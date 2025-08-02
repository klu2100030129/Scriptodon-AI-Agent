from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import csv
import io
from datetime import datetime

from app.core.database import get_db
from app.models.input_source import InputSource
from app.models.test_case import TestCase
from app.models.test_run import TestRun

router = APIRouter()

@router.get("/test-cases/{input_source_id}/csv")
async def export_test_cases_csv(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    """Export test cases to CSV format"""
    try:
        # Get input source
        input_source = db.query(InputSource).filter(InputSource.id == input_source_id).first()
        if not input_source:
            raise HTTPException(status_code=404, detail="Input source not found")
        
        # Get test cases
        test_cases = db.query(TestCase).filter(TestCase.input_source_id == input_source_id).all()
        
        if not test_cases:
            raise HTTPException(status_code=404, detail="No test cases found")
        
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Test Case ID',
            'Title',
            'Description',
            'Steps',
            'Expected Result',
            'Status',
            'Created At'
        ])
        
        # Write data
        for test_case in test_cases:
            writer.writerow([
                test_case.id,
                test_case.title,
                test_case.description or '',
                test_case.steps,
                test_case.expected_result or '',
                test_case.status.value,
                test_case.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        csv_content = output.getvalue()
        output.close()
        
        return {
            "filename": f"test_cases_{input_source.name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "content": csv_content,
            "total_test_cases": len(test_cases)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-runs/{input_source_id}/csv")
async def export_test_runs_csv(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    """Export test runs to CSV format"""
    try:
        # Get input source
        input_source = db.query(InputSource).filter(InputSource.id == input_source_id).first()
        if not input_source:
            raise HTTPException(status_code=404, detail="Input source not found")
        
        # Get test runs
        test_runs = db.query(TestRun).filter(TestRun.input_source_id == input_source_id).all()
        
        if not test_runs:
            raise HTTPException(status_code=404, detail="No test runs found")
        
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Test Run ID',
            'Name',
            'Status',
            'Total Tests',
            'Passed Tests',
            'Failed Tests',
            'Success Rate (%)',
            'Started At',
            'Completed At'
        ])
        
        # Write data
        for test_run in test_runs:
            success_rate = (test_run.passed_tests / test_run.total_tests * 100) if test_run.total_tests > 0 else 0
            writer.writerow([
                test_run.id,
                test_run.name,
                test_run.status.value,
                test_run.total_tests,
                test_run.passed_tests,
                test_run.failed_tests,
                f"{success_rate:.1f}",
                test_run.started_at.strftime('%Y-%m-%d %H:%M:%S'),
                test_run.completed_at.strftime('%Y-%m-%d %H:%M:%S') if test_run.completed_at else ''
            ])
        
        csv_content = output.getvalue()
        output.close()
        
        return {
            "filename": f"test_runs_{input_source.name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "content": csv_content,
            "total_test_runs": len(test_runs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/manual-test-cases/{input_source_id}")
async def get_manual_test_cases(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    """Get test cases formatted for manual testing"""
    try:
        # Get input source
        input_source = db.query(InputSource).filter(InputSource.id == input_source_id).first()
        if not input_source:
            raise HTTPException(status_code=404, detail="Input source not found")
        
        # Get test cases
        test_cases = db.query(TestCase).filter(TestCase.input_source_id == input_source_id).all()
        
        # Format for manual testing
        manual_test_cases = []
        for test_case in test_cases:
            manual_test_cases.append({
                'id': test_case.id,
                'title': test_case.title,
                'description': test_case.description,
                'steps': test_case.steps.split('\n') if test_case.steps else [],
                'expected_result': test_case.expected_result,
                'status': test_case.status.value,
                'is_automated': test_case.is_automated
            })
        
        return {
            "input_source": {
                "id": input_source.id,
                "name": input_source.name,
                "source_type": input_source.source_type.value
            },
            "test_cases": manual_test_cases,
            "total_count": len(manual_test_cases)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update-test-case-status/{test_case_id}")
async def update_test_case_status(
    test_case_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    """Update test case status for manual testing"""
    try:
        test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
        if not test_case:
            raise HTTPException(status_code=404, detail="Test case not found")
        
        # Validate status
        valid_statuses = ['pending', 'passed', 'failed', 'running']
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        # Update status
        test_case.status = status
        db.commit()
        db.refresh(test_case)
        
        return {
            "message": f"Test case status updated to {status}",
            "test_case_id": test_case_id,
            "new_status": status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 