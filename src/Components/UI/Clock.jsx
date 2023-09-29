import React, { useEffect, useState } from 'react'

function Clock() {
    const [days, setdays] = useState()
    const [hours, sethours] = useState()
    const [minutes, setminutes] = useState()
    const [seconds, setseconds] = useState()

    function countDown(){
        const Destination = new Date('oct 10, 2023').getTime()
        let interval = setInterval(() => {
            const now = new Date().getTime()
            const diff = Destination-now 
            const days = Math.floor(diff/(1000*60*60*24))
            const hours = Math.floor(diff%(1000*60*60*24)/(1000*60*60))
            const minutes = Math.floor(diff % (1000*60*60)/(1000*60))
            const seconds = Math.floor(diff%(1000*60)/1000)
            if (Destination < 0) {
                clearInterval(interval.current)
            }else{
                setdays(days)
                sethours(hours)
                setminutes(minutes)
                setseconds(seconds)
            }
        },);
    }

    useEffect(()=>{
        countDown()
    },[])
  return (
    <div className='clock__wrapper d-flex align-items-center gap-3'>
        <div className="clock__data d-flex align-items-center gap-3">
            <div className="text-center">
                <h1 className="text-white fs-3 mb-2">{days}</h1>
                <h5 className='text-white fs-6'>Days</h5>
            </div>
            <span className="text-white fs-3">:</span>
        </div>

        <div className="clock__data d-flex align-items-center gap-3">
            <div className="text-center">
                <h1 className="text-white fs-3 mb-2">{hours}</h1>
                <h5 className='text-white fs-6'>Hours</h5>
            </div>
            <span className="text-white fs-3">:</span>
        </div>

        <div className="clock__data d-flex align-items-center gap-3">
            <div className="text-center">
                <h1 className="text-white fs-3 mb-2">{minutes}</h1>
                <h5 className='text-white fs-6'>Minutes</h5>
            </div>
            <span className="text-white fs-3">:</span>
        </div>

        <div className="clock__data d-flex align-items-center gap-3">
            <div className="text-center">
                <h1 className="text-white fs-3 mb-2">{seconds}</h1>
                <h5 className='text-white fs-6'>seconds</h5>
            </div>
        
        </div>
    </div>
  )
}

export default Clock