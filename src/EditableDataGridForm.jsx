import React, { useState, useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

const grupoOptions = [
    { id: 1, name: "Grupo 1" },
    { id: 2, name: "Grupo 2" },
    { id: 3, name: "Grupo 3" }
];

const initialRows = [
    { id: "a", name: "Alice", grupo: 1, age: 25 },
    { id: "b", name: "Bob", grupo: 2, age: 30 },
    { id: "c", name: "Charlie", grupo: 3, age: 35 },
];

const inputProps = {
    fullWidth: true,
    size: "small"
};
export default function EditableDataGrid() {
    const [rows, setRows] = useState(initialRows);
    const [editingRowId, setEditingRowId] = useState(null);
    const [newRowId, setNewRowId] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const inputRefs = useRef({});

    useEffect(() => {
        console.log("Componente foi montado");
    }, []);

    const isEditing = editingRowId !== null && !isAdding;

    const handleEditClick = (id) => {
        if (isAdding) return;
        setEditingRowId(id);
        const row = rows.find((row) => row.id === id);
        inputRefs.current = { ...row };
    };

    const handleChange = (event, field) => {
        inputRefs.current[field] = event.target.value;
    };

    const handleSave = () => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === editingRowId ? { ...row, ...inputRefs.current } : row
            )
        );
        setEditingRowId(null);
        setIsAdding(false);
        inputRefs.current = {};
    };

    const handleCancel = () => {
        if (isAdding) {
            setRows((prevRows) => prevRows.filter((row) => row.id !== editingRowId));
            setIsAdding(false);
        }
        setEditingRowId(null);
        inputRefs.current = {};
    };

    const handleDelete = (id) => {
        if (isAdding || isEditing) return;
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const handleAddNew = () => {
        if (isEditing) return;
        setIsAdding(true);
        const newId = `new-${newRowId}`;
        setNewRowId((prev) => prev + 1);
        const newRow = { id: newId, name: "", grupo: null, age: "" };
        setRows((prevRows) => [...prevRows, newRow]);
        setEditingRowId(newId);
        inputRefs.current = newRow;
    };

 

    const columns = [
        {
            field: "name",
            headerName: "Nome",
            width: 150,
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <TextField {...inputProps} defaultValue={params.value} onChange={(event) => handleChange(event, "name")} autoFocus />
                ) : (
                    params.value
                ),
        },
        {
            field: "age",
            headerName: "Idade",
            width: 100,
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <TextField {...inputProps} type="number" defaultValue={params.value} onChange={(event) => handleChange(event, "age")} />
                ) : (
                    params.value
                ),
        },
        {
            field: "grupo",
            headerName: "Grupo",
            width: 150,
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <Autocomplete
                        options={grupoOptions}
                        getOptionLabel={(option) => (option ? option.name : "")}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        value={grupoOptions.find((g) => g.id === (inputRefs.current["grupo"] ?? params.value)) || null}
                        onChange={(event, newValue) => {
                            inputRefs.current["grupo"] = newValue ? newValue.id : null;
                        }}
                        renderInput={(params) => <TextField {...params} {...inputProps} />}
                    />
                ) : (
                    grupoOptions.find((g) => g.id === params.value)?.name || ""
                ),
        },
        {
            field: "actions",
            headerName: "Ações",
            width: 200,
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <>
                        <IconButton onClick={handleSave} color="primary">
                            <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancel} color="secondary">
                            <CancelIcon />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <IconButton onClick={() => handleEditClick(params.row.id)} color="primary" disabled={isAdding || isEditing}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(params.row.id)} color="error" disabled={isAdding || isEditing}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                ),
        },
    ];

    return (
        <>
            <Button onClick={handleAddNew} variant="contained" color="primary" style={{ marginBottom: 10 }} disabled={isAdding || isEditing}>
                Adicionar Novo
            </Button>
            <DataGrid getRowHeight={() => "auto"} columnHeaderHeight={35} rows={rows} columns={columns} disableSelectionOnClick />
        </>
    );
}
