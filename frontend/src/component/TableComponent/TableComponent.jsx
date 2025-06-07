import { Table } from "antd";
import React, { useRef, useState } from "react";
import Loading1 from "../LoadingComponent/Loading1";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TableComponent = (props) => {
    const {
        selectionType = 'checkbox',
        data = [],
        isLoading = false,
        columns = [],
        handleDeleteMany
    } = props;

    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
    };

    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys);
    };

    const exportToExcel = () => {
        const exportData = selectedRows.length > 0 ? selectedRows : data;

        const formattedData = exportData.map((row) => {
            const result = {};
            columns.forEach((col) => {
                if (typeof col.dataIndex === 'string') {
                    result[col.title] = row[col.dataIndex];
                } else {
                    result[col.title] = '';
                }
            });
            return result;
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(blob, 'table_export.xlsx');
    };

    return (
        <Loading1 isPending={isLoading}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                {rowSelectedKeys.length > 0 && (
                    <div
                        style={{
                            background: 'rgb(29,29,221)',
                            color: '#fff',
                            fontWeight: 'bold',
                            padding: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={handleDeleteAll}
                    >
                        Xóa tất cả
                    </div>
                )}

                <button
                    onClick={exportToExcel}
                    style={{
                        background: '#52c41a',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '10px 16px',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                    }}
                >
                    Export Excel
                </button>
            </div>

            <Table
                rowSelection={{ type: selectionType, ...rowSelection }}
                columns={columns}
                dataSource={data}
                {...props}
            />
        </Loading1>
    );
};

export default TableComponent;
