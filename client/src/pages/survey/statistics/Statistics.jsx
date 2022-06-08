import "./statistics.scss"

import Sidebar from "../../../components/sidebar/Sidebar"
import Loading from "../../../components/loading/Loading"

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { PieChart, Pie, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {useEffect, useState} from 'react'

import Axios from "axios"

function Statistics() {

    const surveyID = window.location.pathname.split("/").pop() === "create" ? null : window.location.pathname.split("/").pop()
    const [answers, setAnswers] = useState([])
    const [survey, setSurvey] = useState([])
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState([])

    

    useEffect(() => {
        if(surveyID !== null)
        {   
            Axios({
                method: "GET",
                url: process.env.REACT_APP_API_BASE + "/getSurveyResults/" + surveyID,
                withCredentials: true,
            }).then(res => setAnswers(res.data))
            .then(() => 
            Axios({
                method: "GET",
                withCredentials: true,
                params:{
                    id: surveyID
                },
                url: process.env.REACT_APP_API_BASE + "/getSurvey",
            }).then(res => {setSurvey(res.data); setQuestions(JSON.parse(res.data.json)['pages'][0]['elements'].slice(1));})
            ).then(() => setLoading(false))
        }
    },[])
  

    if(loading){
        return <Loading/>
    }
  

  return (
    <div className="statistics">
        <Sidebar/>
        <div className="statisticsContainer">
            <div className="top">
                <div className="title">{survey.title}</div>
            </div>
            <div className="bottom">
                <div className="questionContainer">
               {questions.map( (q, index) => {
                    return <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className="question"
                    >
                        <Typography><div className="questionTop">
                        <div className="circle">Q.{index+1}</div>
                                    <div className="questionTitle">{q.name}</div>
                                    </div></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <div className="result">
                                    <Question json={q} answers={answers}/>
                                </div>
                        
                    </AccordionDetails>
                    </Accordion>
                        
                    }) }
                </div>
            </div>
        </div>
    </div>
  )
}


const Question = ({json,answers}) => {
    let data = []
    switch(json.type){
        case 'text':
            return <div>
                {answers.map((a) => {
                return <p className="text" key={a.id}>{a["json"][json.name]}</p>
                })}
                </div>
            
        case 'checkbox':
            data = []
            json.choices.map(c => {
                var value = 0
                answers.map((a) => {
                    if(a['json'][json.name])
                    {
                        a['json'][json.name].map((j) => {
                            if(j === c)
                            {
                                value += 1
                            }
                        })
                    }
                    
                })
                data.push({name: c, value: value})
            })
            return (
                <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>)
        case 'radiogroup':
            data = []
            json.choices.map(c => {
                var value = 0
                answers.map((a) => {
                    if(a['json'][json.name] === c)
                    {
                        value += 1
                    }
                })
                data.push({name: c, value: value})
            })
            return (
                <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>) 
        case 'dropdown':
            data = []
            json.choices.map(c => {
                var value = 0
                answers.map((a) => {
                    if(a['json'][json.name] === c)
                    {
                        value += 1
                    }
                })
                data.push({name: c, value: value})
            })
            return (
                <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>)
        case 'comment':
            return <div>
            {answers.map((a) => {
            return <p className="text" key={a.id}>{a["json"][json.name]}</p>
            })}
            </div>
        case 'ranking':
            data = []
            json.choices.map((c,index) => {
                var j = {name: index+1}
                json.choices.map((c) => {
                    j[c] = 0
                })
                data.push(j)
            })
            
                answers.map((c) => {
                    if(c['json'][json.name]){
                        c['json'][json.name].map((x, l) => {
                            data[l][x] += 1
                        })
                    }
                })
            
            
            return (
                <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {json.choices.map((c, i) => {
                    return <Bar dataKey={c} fill={randomColor(i)} />
                })}
                </BarChart>
                )
        case 'boolean':
            return <PieChartStats answers={answers} title={json.name}/>
        case 'rating':
            data = []
            Array.from({length: (json.rateMax)}, (index, i) => {
                var value = 0
                answers.map((a) => {
                    if(a['json'][json.name] === i+1)
                    {
                        value += 1
                    }
                })
                data.push({name: i+1, value: value})
            })
            return (
                <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>)
        case 'signaturepad':
            return 
        default:
            return
    }
}

const randomColor = (i) => {
    const colors = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#3366cc","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"]
    return colors[i]
}

function PieChartStats({answers, title}) {

    
    var yes = 0;
    var no = 0;

    answers.map((a) => {
        if(a["json"][title])
        {
            yes += 1
        }else{
            no += 1
        }
        })

        const data01 = [
            { name: 'Yes', value: yes },
            { name: 'No', value: no },
          ];
    

      const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
      
        return (
          <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
              {payload.name}
            </text>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={startAngle}
              endAngle={endAngle}
              fill={fill}
            />
            <Sector
              cx={cx}
              cy={cy}
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={outerRadius + 6}
              outerRadius={outerRadius + 10}
              fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
              {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
          </g>
        );
      };

    const [state, setState] = useState(0)
    
    const onPieEnter = (_, index) => {
        setState(index)
    };
      

    return <PieChart width={400} height={400}>
    <Pie
      activeIndex={state}
      activeShape={renderActiveShape}
      data={data01}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
      onMouseEnter={onPieEnter}
    />
  </PieChart>
}

export default Statistics