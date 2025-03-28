import React, { useState, useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CssBaseline, GlobalStyles, IconButton, TextField, ThemeProvider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";



const initialRows = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 35 },
];

export default function EditableDataGrid() {
    
    const [rows, setRows] = useState(initialRows);
    const [editingRowId, setEditingRowId] = useState(null);
    const inputRefs = useRef({}); // Armazena os valores editados sem re-renderizar

    useEffect(() => {
        console.log("Componente foi montado");
    }, []); // Só executa na montagem do componente

    const handleEditClick = (id) => {
        setEditingRowId(id);
        const row = rows.find((row) => row.id === id);
        inputRefs.current = { ...row }; // Armazena os valores atuais sem causar re-renderização
    };

    const handleChange = (event, field) => {
        inputRefs.current[field] = event.target.value; // Atualiza diretamente no useRef
        
    };

    const handleSave = () => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === editingRowId ? { ...row, ...inputRefs.current } : row
        
            )
            
        );
        console.log(inputRefs.current)
        setEditingRowId(null);
        inputRefs.current = {}; // Limpa os valores após salvar
    };

    const handleCancel = () => {
        setEditingRowId(null);
        inputRefs.current = {}; // Limpa os valores ao cancelar
    };

    const handleDelete = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const isEditing = editingRowId !== null;
    
    const columns = [
        {   
            field: "name",
            headerName: "Nome",
            width: 150,

            headerClassName:"headercolor",
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <TextField                      
                        defaultValue={params.value}
                        onChange={(event) => handleChange(event, "name")}
                        size="small"
                        autoFocus
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: "age",
            headerName: "Idade",
            width: 100,
            headerClassName:"headercolor",
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <TextField
                        type="number"
                        defaultValue={params.value}
                        onChange={(event) => handleChange(event, "age")}
                        size="small"
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: "actions",
            headerName: "Ações",
            headerClassName:"headercolor",
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
                        <IconButton
                            onClick={() => handleEditClick(params.row.id)}
                            color="primary"
                            disabled={isEditing} // Desativa enquanto outra linha está sendo editada
                        >
                            <EditIcon    />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDelete(params.row.id)}
                            color="error"
                            disabled={isEditing} // Desativa enquanto edita
                        >
                            <DeleteIcon   />
                        </IconButton>
                    </>
                ),
        },
    ];
  
    return (

        
        // <div 
        
        // style={{ height: 300, width: "70%",background:"#efebe2",
        // boxShadow:"35px 35px 70pxrgb(237, 230, 212) -35px -35px 70px #ffffff",
        // display: 'flex',
        // flexDirection: 'column'
        // }}>
            
            <DataGrid  getRowHeight={() => 'auto'} columnHeaderHeight={35}  rows={rows} columns={columns} disableSelectionOnClick />
        // </div>
       
       
    );
    
}
