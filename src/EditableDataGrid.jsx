import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, GlobalStyles, TextField } from "@mui/material";
import "./styles.css"; // Importa o CSS

import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const initialRows = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 35 },
];

export default function EditableDataGrid() {
    const [rows, setRows] = useState(initialRows);
    const [editingRowId, setEditingRowId] = useState(null);
    const [tempRow, setTempRow] = useState(null);
    const [columnWidths, setColumnWidths] = useState({
        name: 500, // Largura inicial da coluna "Nome"
        age: 100,  // Largura inicial da coluna "Idade"
    });

        useEffect(() => {
            console.log("Componente foi renderizado");
        });
    // // Atualiza as larguras das colunas ao redimensionar
    // const handleColumnResize = (params) => {
    //     const { field, width } = params;
    //     setColumnWidths((prevWidths) => ({
    //         ...prevWidths,
    //         [field]: width, // Armazena o novo tamanho da coluna
    //     }));
    // };

   

    // Colunas da DataGrid
    const columns = [
        {
            field: "name",
            headerName: "Nome",
            width: columnWidths.name,
            resizable: false, 
            
            renderCell: (params) =>
                editingRowId === params.id ? (
                    <TextField
                        value={tempRow.name}
                        // onChange={(event) => handleChange(event, "name")}
                        size="small"
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: "age",
            headerName: "Idade",
          
            width: columnWidths.age,
            renderCell: (params) =>
                editingRowId === params.id ? (
                    <TextField
                        type="number"
                        value={tempRow.age}
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
           
            width: 360,
            renderCell: (params) =>
                editingRowId === params.id ? (
                    <>
                        <IconButton onClick={() => handleSave(params.id)} color="primary">
                            <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancel} color="secondary">
                            <CancelIcon />
                        </IconButton>
                    </>
                ) : (
                    <IconButton onClick={() => handleEditClick(params.id)} color="primary">
                        <EditIcon />
                    </IconButton>
                ),
        },
    ];

    // Atualiza os valores conforme o usuário digita
    // const handleChange = (event, field) => {
    //     event.preventDefault();
    //     setTempRow((prev) => ({ ...prev, [field]: event.target.value }));
    // };

    // Salva os dados editados
    const handleSave = (id) => {
        setRows((prevRows) => prevRows.map((row) => (row.id === id ? tempRow : row)));
        setEditingRowId(null);
        setTempRow(null);
    };

    // Cancela a edição
    const handleCancel = () => {
        setEditingRowId(null);
        setTempRow(null);
    };

    const handleEditClick = (id) => {
        setEditingRowId(id);
        setTempRow(rows.find((row) => row.id === id)); // Clona os dados da linha
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submission prevented!', event);
        // You can add your form handling logic here
      };

    return (
        <form onSubmit={handleSubmit}>
           
            <DataGrid            
                rows={rows}
                columns={columns}
                disableSelectionOnClick
                
              // Adiciona o evento de redimensionamento
            />
            
        </form>
    );
}
