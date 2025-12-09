<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportExport implements FromCollection, WithHeadings, WithStyles
{
    protected $data;
    protected $type;

    public function __construct($data, $type)
    {
        $this->data = collect($data);
        $this->type = $type;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        switch ($this->type) {
            case 'projects':
                return [
                    'ID', 'Name', 'Status', 'Total Tasks', 'Completed Tasks', 
                    'Pending Tasks', 'In Progress Tasks', 'Overdue Tasks', 
                    'Completion Rate (%)', 'Team Count', 'Created At', 'Deadline'
                ];
            case 'teams':
                return [
                    'ID', 'Name', 'Project Name', 'Member Count', 'Active Members',
                    'Total Tasks', 'Completed Tasks', 'Completion Rate (%)', 'Created At'
                ];
            case 'tasks':
                return [
                    'ID', 'Title', 'Status', 'Priority', 'Progress (%)', 'Assigned To',
                    'Created By', 'Project Name', 'Team Name', 'Deadline', 'Is Overdue',
                    'Created At', 'Completed At'
                ];
            case 'users':
                return [
                    'ID', 'Name', 'Email', 'Role', 'Total Assigned Tasks', 'Completed Tasks',
                    'Pending Tasks', 'In Progress Tasks', 'Overdue Tasks', 'Completion Rate (%)',
                    'Created Tasks', 'Last Login', 'Status'
                ];
            default:
                return [];
        }
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
