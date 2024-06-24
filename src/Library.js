// src/Library.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './assets/css/reset.css';
import {CircularProgressbarWithChildren} from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
import './assets/css/ProgressbarCustom.css';
import './assets/css/Library.css';

// img
import wigerBasic from './assets/images/wiger-basic-bw.png';

const Library = () => {
    const [userId, setUserId] = useState('');
    const [lentList, setLentList] = useState([]);
    const [lendingList, setLendingList] = useState([]);
    const [weeklyCounts, setWeeklyCounts] = useState([]);
    const [weeklyParticipation, setWeeklyParticipation] = useState([]);

    const fetchLentData = async (id) => {
        try {
            const response = await axios.get(`/api/Ebook_Lent_list_xml.asp?user_id=${id}`);
            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');
            const items = xml.getElementsByTagName('item');
            const lentArray = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const lendingDate = item.getElementsByTagName('lending_date')[0].textContent;
                const returnedDate = item.getElementsByTagName('returned_date')[0]?.textContent;
                lentArray.push({
                    lendingDate,
                    returnedDate
                });
            }
            setLentList(lentArray);
        } catch (error) {
            console.error("There was an error fetching the lent data!", error);
        }
    };

    const fetchLendingData = async (id) => {
        try {
            const response = await axios.get(`/api/Ebook_Lending_list_xml.asp?user_id=${id}`);
            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');
            const items = xml.getElementsByTagName('item');
            const lendingArray = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const lendingDate = item.getElementsByTagName('lending_date')[0].textContent;
                const expiredDate = item.getElementsByTagName('expired_date')[0].textContent;
                lendingArray.push({
                    lendingDate,
                    expiredDate
                });
            }
            setLendingList(lendingArray);
        } catch (error) {
            console.error("There was an error fetching the lending data!", error);
        }
    };

    const handleSearch = () => {
        if (userId.trim() === '') {
            alert('학번을 입력해주세요.');
            return;
        }
        fetchLentData(userId);
        fetchLendingData(userId);
    };

    useEffect(() => {
        if (lentList.length > 0 || lendingList.length > 0) {
            console.log("Calculating event participation");
            const eventStartDate = new Date('2024-06-17');
            const eventEndDate = new Date('2024-07-19');

            const isWithinEventPeriod = date => {
                const d = new Date(date);
                return d >= eventStartDate && d <= eventEndDate;
            };

            const getWeekNumber = date => {
                const start = new Date(eventStartDate);
                const diff = new Date(date) - start;
                return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
            };

            const weeklyCountsArray = new Array(5).fill(0); // 5주간의 카운트 배열

            // 대출 중인 도서와 반납된 도서 모두 고려
            [...lentList, ...lendingList].forEach(item => {
                const lendingDate = new Date(item.lendingDate);
                const returnedDate = item.returnedDate ? new Date(item.returnedDate) : null;

                // 당일 대출 당일 반납은 제외
                if (returnedDate && lendingDate.toDateString() === returnedDate.toDateString()) {
                    return;
                }

                if (isWithinEventPeriod(item.lendingDate)) {
                    const week = getWeekNumber(item.lendingDate);
                    if (week >= 0 && week < 6) {
                        weeklyCountsArray[week]++;
                    }
                }
            });

            setWeeklyCounts(weeklyCountsArray);
            setWeeklyParticipation(weeklyCountsArray.map(count => count >= 5));
        }
    }, [lentList, lendingList]);

    return (
        <div className="container">
            <div className="id-finder">
                <p>챌린지 도전 현황</p>
                <input
                    type="text"
                    placeholder="학번"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={handleSearch}>조회</button>
            </div>
            {userId && (
                <div>
                    <h2>주차별 이벤트 참여 여부</h2>
                    <ul className="badge-list">
                        {weeklyParticipation.map((participated, index) => (
                            <li key={index} className="badge">
                                {index + 1}주차: {participated ? '참여' : '미참여'} ({weeklyCounts[index]}권 대출)
                                <div className="progress-box">
                                    <CircularProgressbarWithChildren
                                        value={weeklyCounts[index]}
                                        maxValue={5}
                                        styles={{
                                            trail: {
                                                stroke: '#eeeeee',
                                                strokeLinecap: 'butt',
                                                transform: 'rotate(0.25turn)',
                                                transformOrigin: 'center center',
                                            }
                                        }}
                                    >
                                        <img style={{width: 100, marginTop: -5}} src={wigerBasic}
                                             alt="wiger"/>
                                    </CircularProgressbarWithChildren>
                                </div>
                                {/*<div style={{*/}
                                {/*    width: '100%',*/}
                                {/*    backgroundColor: '#e0e0e0',*/}
                                {/*    borderRadius: '4px',*/}
                                {/*    margin: '5px 0'*/}
                                {/*}}>*/}
                                {/*<div*/}
                                {/*    style={{*/}
                                {/*        width: `${(weeklyCounts[index] / 5) * 100}%`,*/}
                                {/*        backgroundColor: participated ? 'green' : 'red',*/}
                                {/*        height: '10px',*/}
                                {/*        borderRadius: '4px'*/}
                                {/*    }}*/}
                                {/*></div>*/}
                                {/*</div>*/}
                            </li>
                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
};

export default Library;