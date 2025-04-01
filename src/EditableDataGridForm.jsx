import React, { useState, useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Autocomplete, CssBaseline, GlobalStyles, IconButton, TextField, ThemeProvider } from "@mui/material";
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
    { id: 'a', name: "Alice", grupo: 1, age: 25 },
    { id: 'b', name: "Bob", grupo: 2, age: 30 },
    { id: 'c', name: "Charlie", grupo: 3, age: 35 },
];

export default function EditableDataGrid() {

    const [rows, setRows] = useState(initialRows);
    const [editingRowId, setEditingRowId] = useState(null);
    const inputRefs = useRef({}); // Armazena os valores editados sem re-renderizar

    useEffect(() => {
        console.log("Componente foi montado");
    }, []); // Só executa na montagem do componente

    const handleEditClick = (id) => {
        console.log('linha a ser alterada ', id)
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
        console.log(editingRowId, inputRefs.current)
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

            headerClassName: "headercolor",
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <TextField
                        defaultValue={params.value}
                        fullWidth={true}
                        onChange={(event) => handleChange(event, "name")}
                        size="small"
                        onKeyDown={(event) => {
                            if (event.key === " ") {
                                event.stopPropagation(); // Evita que o espaço perca o foco
                            }
                        }}

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
            headerClassName: "headercolor",
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <TextField
                        type="number"
                        defaultValue={params.value}
                        onChange={(event) => handleChange(event, "age")}
                        onKeyDown={(event) => {
                            if (event.key === " ") {
                                event.stopPropagation(); // Evita que o espaço perca o foco
                            }
                        }}
                        size="small"
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: "grupo",
            headerName: "Grupo",
            width: 150,
            headerClassName: "headercolor",
            renderCell: (params) =>
                editingRowId === params.row.id ? (
                    <Autocomplete
                        options={grupoOptions}
                        getOptionLabel={(option) => (option ? option.name : "")}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        value={grupoOptions.find((g) => g.id === inputRefs.current["grupo"]) || null} // Encontra o objeto correspondente ao ID armazenado
                        onChange={(event, newValue) => {
                            inputRefs.current["grupo"] = newValue ? newValue.id : null; // Armazena apenas o ID
                        }}
                        renderInput={(params) => <TextField {...params} 
                        onKeyDown={(event) => {
                            if (event.key === " ") {
                                event.stopPropagation(); // Evita que o espaço perca o foco
                            }
                        }}
                        
                        />}
                        fullWidth
                    />
                ) : (
                    grupoOptions.find((g) => g.id === params.value)?.name || "" // Exibe o nome baseado no ID armazenado
                ),
        },

        {
            field: "actions",
            headerName: "Ações",
            headerClassName: "headercolor",
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
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDelete(params.row.id)}
                            color="error"
                            disabled={isEditing} // Desativa enquanto edita
                        >
                            <DeleteIcon />
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
        <>
            <style>
                {`
            .centered-cell {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          `}
            </style>
            <DataGrid
                getRowHeight={() => "auto"}
                columnHeaderHeight={35}
                rows={rows}
                columns={columns}
                disableSelectionOnClick
            />
        </>
        // </div>


    );

}
