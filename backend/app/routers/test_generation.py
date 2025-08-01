from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from app.core.database import get_db
from app.schemas.test_case import TestCaseCreate, TestCaseResponse
from app.schemas.test_run import TestRunCreate, TestRunResponse
from app.services.ai_service import AIService
from app.services.test_execution_service import TestExecutionService
from app.models.input_source import InputSource
from app.models.test_case import TestCase
from app.models.test_run import TestRun

router = APIRouter()
ai_service = AIService()
test_execution_service = TestExecutionService()

@router.post("/generate/{input_source_id}")
async def generate_test_cases(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    """Generate test cases from input source using AI"""
    try:
        # Get input source
        input_source = db.query(InputSource).filter(InputSource.id == input_source_id).first()
        if not input_source:
            raise HTTPException(status_code=404, detail="Input source not found")
        
        # Generate test cases using AI
        test_cases_data = await ai_service.generate_test_cases(
            input_source.content, 
            input_source.source_type.value
        )
        
        # Save test cases to database
        saved_test_cases = []
        for test_case_data in test_cases_data:
            test_case = TestCase(
                title=test_case_data.get('title', 'Generated Test Case'),
                description=test_case_data.get('description', ''),
                steps=test_case_data.get('steps', ''),
                expected_result=test_case_data.get('expected_result', ''),
                input_source_id=input_source_id
            )
            db.add(test_case)
            saved_test_cases.append(test_case)
        
        db.commit()
        
        return {
            "message": f"Generated {len(saved_test_cases)} test cases",
            "test_cases": saved_test_cases,
            "input_source_id": input_source_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/execute/{input_source_id}")
async def execute_test_cases(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    """Execute test cases for an input source"""
    try:
        # Get test cases for the input source
        test_cases = db.query(TestCase).filter(TestCase.input_source_id == input_source_id).all()
        
        if not test_cases:
            raise HTTPException(status_code=404, detail="No test cases found for this input source")
        
        # Convert to dictionary format for execution
        test_cases_data = []
        for test_case in test_cases:
            test_cases_data.append({
                'title': test_case.title,
                'description': test_case.description,
                'steps': test_case.steps,
                'expected_result': test_case.expected_result
            })
        
        # Execute test cases
        execution_results = await test_execution_service.execute_test_cases(test_cases_data)
        
        # Create test run record
        test_run = TestRun(
            name=f"Test Run for Input Source {input_source_id}",
            input_source_id=input_source_id,
            total_tests=execution_results['total_tests'],
            passed_tests=execution_results['passed_tests'],
            failed_tests=execution_results['failed_tests'],
            results_summary=test_execution_service.generate_execution_report(execution_results)
        )
        
        db.add(test_run)
        db.commit()
        db.refresh(test_run)
        
        return {
            "test_run_id": test_run.id,
            "execution_results": execution_results,
            "summary": {
                "total": execution_results['total_tests'],
                "passed": execution_results['passed_tests'],
                "failed": execution_results['failed_tests'],
                "success_rate": (execution_results['passed_tests'] / execution_results['total_tests'] * 100) if execution_results['total_tests'] > 0 else 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-cases/{input_source_id}")
async def get_test_cases(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    """Get all test cases for an input source"""
    test_cases = db.query(TestCase).filter(TestCase.input_source_id == input_source_id).all()
    return test_cases

@router.get("/test-runs/{input_source_id}")
async def get_test_runs(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    """Get all test runs for an input source"""
    test_runs = db.query(TestRun).filter(TestRun.input_source_id == input_source_id).all()
    return test_runs

@router.delete("/test-cases/{test_case_id}")
async def delete_test_case(
    test_case_id: int,
    db: Session = Depends(get_db)
):
    """Delete a specific test case"""
    test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if not test_case:
        raise HTTPException(status_code=404, detail="Test case not found")
    
    db.delete(test_case)
    db.commit()
    return {"message": "Test case deleted successfully"}

@router.delete("/test-runs/{test_run_id}")
async def delete_test_run(
    test_run_id: int,
    db: Session = Depends(get_db)
):
    """Delete a specific test run"""
    test_run = db.query(TestRun).filter(TestRun.id == test_run_id).first()
    if not test_run:
        raise HTTPException(status_code=404, detail="Test run not found")
    
    db.delete(test_run)
    db.commit()
    return {"message": "Test run deleted successfully"} 