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
import logo from './assets/images/lib-logo.png';
import wiger1 from './assets/images/wiger_1.png';
import wiger2 from './assets/images/wiger_2.png';
import wiger3 from './assets/images/wiger_3.png';
import wiger4 from './assets/images/wiger_4.png';
import wiger5 from './assets/images/wiger_5.png';

const wigerImages = [wiger1, wiger2, wiger3, wiger4, wiger5];

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
            <section className="top-container">
                <div className="title">
                    <span>2024</span>
                    <p>여름방학</p>
                    <p>독서 챌린지</p>
                </div>
            </section>
            <section className="id-finder">
                <p>나의 챌린지 도전 현황</p>
                <input
                    type="text"
                    placeholder="학번"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={handleSearch}>조회</button>
            </section>
            {/* result section start */}
            {userId && (
                <section className="result-container">
                    <ul className="badge-list">
                        {weeklyParticipation.map((participated, index) => (
                            <li key={index} className="badge">
                                <div className="progress-box">
                                    <CircularProgressbarWithChildren
                                        value={weeklyCounts[index]}
                                        maxValue={5}
                                        styles={{
                                            path: {
                                                // Path color
                                                // stroke: `rgba(62, 152, 199, ${percentage / 100})`,
                                                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                stroke: '#000000',
                                                strokeLinecap: 'round',
                                                strokeWidth: '4',
                                                // Customize transition animation
                                                transition: 'stroke-dashoffset 0.5s ease 0s',
                                                // Rotate the path
                                                transformOrigin: 'center center',
                                            },
                                            trail: {
                                                stroke: '#eeeeee',
                                                strokeLinecap: 'butt',
                                                transform: 'rotate(0.25turn)',
                                                transformOrigin: 'center center',
                                                strokeWidth: '4',
                                            }
                                        }}
                                    >
                                        <img style={{width: "80%"}} src={participated ? wigerImages[index] : wigerBasic} alt="wiger"/>
                                    </CircularProgressbarWithChildren>

                                </div>
                                <p>{index + 1}주차</p>
                                <span>({weeklyCounts[index]}/5)</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {/* result section end */}

            {/* footer start */}
            <footer>
                <img src={logo}/>
            </footer>
            {/* footer end */}
        </div>
    );
};

export default Library;