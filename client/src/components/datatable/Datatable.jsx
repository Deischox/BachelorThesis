import "./datatable.scss"

import { DataGrid } from '@mui/x-data-grid';


function Datatable({columns,rows}) {

    return (
        <div className="datatable">
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
            />
        </div>
      )
}

export default Datatable