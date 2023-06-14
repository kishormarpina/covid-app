import './App.css';
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';

const App = () => {
  const url = "https://covid-193.p.rapidapi.com/statistics"
  const [obj, setObj] = useState({})
  const [flag, setFlag] = useState({})
  const [filterData, setFilterData] = useState({})
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const obj = {}
      const resp = await fetch(url, {
        headers: {
          'X-RapidAPI-Host': 'covid-193.p.rapidapi.com',
          'X-RapidAPI-Key': '70e58ed9dfmshb0ae2aca7328d61p1563fcjsn2835c7be9924'
        }
      })
      const res = await resp.json()
      let fl = []
      res.response.forEach((el) => {
        if (el.continent) {
          if (obj[el.continent]) {
            obj[el.continent].push({ 'country': el.country, 'population': el.population, 'cases': el.cases.total })
          } else {
            obj[el.continent] = [{ 'country': el.country, 'population': el.population, 'cases': el.cases.total }]
            fl[el.continent] = false
          }
        }
      })
      setObj(obj)
      setFlag(fl)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const arr = Object.keys(obj)
    let filData = {}
    let ff = {}
    for (let i = 0; i < arr.length; i++) {
      let cn = obj[arr[i]].filter((ele) => ele.country.toLowerCase().includes(query.toLowerCase()))
      if (cn.length > 0) {
        filData[arr[i]] = cn
        if (query) { ff[arr[i]] = true; }
      } else {
        ff[arr[i]] = false
      }
    }
    setFilterData(filData)
    setFlag(ff)
  }, [obj, query])
  if (!filterData) {
    return <div>Loading...</div>;
  }
  const handleChange = (e) => {
    setQuery(e.target.value)
  }
  const openContryView = (el, ind) => {
    let ff = JSON.parse(JSON.stringify(flag))
    ff[el] = !ff[el];
    setFlag(ff);
  }
  return (
    <div>

      <h1>Covid Cases Tracking</h1>
      <h2>View the cases Continent wise</h2>
      <label className='lable'>Search By Country</label>
      <input placeholder='Enter Country Name...' type='text' value={query} onChange={(e) => handleChange(e)} className='query'></input>
      {Object.keys(filterData).map((el, ind) => (
        <div>
          <div key={ind} className='box' id='box'>
            <div className='continent' >
              {el}
            </div>
            <button onClick={e => openContryView(el, ind)} id='btn' className='btn'>View</button>
          </div>
          {flag[el] && <div >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Country</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Population</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Cases</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData[el].map((item, ind) => (
                    <TableRow key={ind} >
                      <TableCell >{item.country}</TableCell>
                      <TableCell >{item.population}</TableCell>
                      <TableCell >{item.cases}</TableCell>
                    </TableRow>))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>}
        </div>

      ))
      }
    </div>

  )
}

export default App;
