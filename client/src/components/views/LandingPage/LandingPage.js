import React, {useEffect} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'

function LandingPage(props) {
    //LandingPage에 들어오자마자 userEffect메서드 실행
    useEffect(() => {
        axios.get('/api/hello')
            .then(response => { console.log(response) })
    }, [])

    const onClickHandler = () =>{
        axios.get('/api/users/logout')
        .then(response => {
            console.log(response.data)
            if(response.data.success){
                props.history.push('/login')        //history를 사용하려면 withRouter 필요
            }else{
                alert('로그아웃 하는데 실패했습니다.')
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent:'center', alignItems:'center',
            width:'100%', height:'100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage)
