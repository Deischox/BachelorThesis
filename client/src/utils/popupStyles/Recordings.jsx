import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';


export default function RecordingsStyle({record, setRecord}){

  
return (
<div>
    <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Record Settings</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={record}
            label="Record Settings"
            onChange={(e) => setRecord(e.target.value)}
            >
            <MenuItem value='participant'>Record only Participant</MenuItem>
            <MenuItem value='Host'>Record Host and Participant</MenuItem>
            </Select>
        </FormControl>
    </Box>
</div>
)}