import React, { useRef } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

function MyHandsontable() {
  const containerRef = useRef(null);

  React.useEffect(() => {
    const hot = new Handsontable(containerRef.current, {
      data: [
        ["Alice", 25],
        ["Bob", 30],
        ["Charlie", 35]
      ],
      colHeaders: ["Nome", "Idade", "Ação"],
      columns: [
        { type: 'text', readOnly: true }, // Desabilita a edição por padrão
        { type: 'numeric', readOnly: true }, // Desabilita a edição por padrão
        {
          type: 'text',
          renderer: (instance, td, row, col, prop, value) => {
            // Adiciona o botão de edição
            td.innerHTML = `<button onClick="editRow(${row})">Editar</button>`;
          }
        }
      ],
      rowHeaders: true,
      filters: true,
      dropdownMenu: true,
      contextMenu: true
    });

    // Função para habilitar a edição da linha ao clicar no botão
    window.editRow = (rowIndex) => {
      const columnsCount = hot.countCols(); // Quantidade de colunas na tabela
      for (let col = 0; col < columnsCount - 1; col++) { // Ignora a coluna de "Ação"
        hot.setCellMeta(rowIndex, col, 'readOnly', false); // Habilita a edição da célula
      }
      hot.render(); // Atualiza a tabela para refletir as mudanças

      // Alteração visual do botão para indicar que a linha está em modo de edição
      alert(`Agora você pode editar a linha ${rowIndex + 1}`);
    };

  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: 400 }} />;
}

export default MyHandsontable;
