// src/Library.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './assets/css/reset.css';
import {CircularProgressbarWithChildren} from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
import './assets/css/ProgressbarCustom.css';
import './assets/css/Library.css';
import './assets/css/LibraryMobile.css';

// layout
import Notice from './Notice.js';

// img
// import wigerBasic from './assets/images/wiger-basic-bw.png';
import wigerBook from './assets/images/wiger-book-bw.png';
import logo from './assets/images/lib-logo.png';
import wiger1 from './assets/images/wiger_1.png';
import wiger2 from './assets/images/wiger_2.png';
import wiger3 from './assets/images/wiger_3.png';
import wiger4 from './assets/images/wiger_4.png';
import wiger5 from './assets/images/wiger_5.png';
import iconSearch from './assets/images/icon-search.png';

const wigerImages = [wiger1, wiger2, wiger3, wiger4, wiger5];
const dateStrings = ["7/8 ~ 7/14", "7/15 ~ 7/21", "7/22 ~ 7/28", "7/29 ~ 8/4", "8/5 ~ 8/16"]

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
            const resultCode = xml.getElementsByTagName('ResultCode')[0].textContent;
            if (resultCode !== "0") {
                alert("존재하지 않는 이용자입니다.");
                return [];
            }
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
            return lentArray;
        } catch (error) {
            console.error("There was an error fetching the lent data!", error);
            return [];
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
            return lendingArray;
        } catch (error) {
            console.error("There was an error fetching the lending data!", error);
            return [];
        }
    };

    const handleSearch = async () => {
        if (userId.trim() === '') {
            alert('학번을 입력해주세요.');
            return;
        }
        // 상태 초기화
        setLentList([]);
        setLendingList([]);
        setWeeklyCounts([]);
        setWeeklyParticipation([]);

        // 데이터 로드
        const lentData = await fetchLentData(userId);
        const lendingData = await fetchLendingData(userId);

        // 상태 업데이트
        setLentList(lentData);
        setLendingList(lendingData);
    };

    // userId가 변경될 때 상태 초기화
    useEffect(() => {
        if (userId.trim() === '') {
            setLentList([]);
            setLendingList([]);
            setWeeklyCounts([]);
            setWeeklyParticipation([]);
        }
    }, [userId]);

    useEffect(() => {
        if (lentList.length > 0 || lendingList.length > 0) {
            console.log("Calculating event participation");
            const eventStartDate = new Date('2024-05-27');
            const eventEndDate = new Date('2024-06-30');

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
            setWeeklyParticipation(weeklyCountsArray.map((count, index) => index === 4 ? count >= 10 : count >= 5)); // 5주차는 10권
        }
    }, [lentList, lendingList]);

    return (
        <div className="body">
            <section className="top">
                <div className="container">
                    <span className="univname">영진전문대학교</span>
                    <span className="univname">하계방학 도서관 문화행사</span>
                    <div className="title">
                        <p>여름 독서</p>
                        <p>챌린지</p>
                        <span className="date">7월 8일 ~ 8월 16일 </span>
                    </div>
                </div>
            </section>
            <Notice />
            {/* result section start */}
            <section className="content">
                <div className="container finder">
                    <p>⭐ 나의 챌린지 현황 ⭐</p>
                    <div className="finder-input">
                        <input
                            type="text"
                            placeholder="학번"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <button onClick={handleSearch}>
                            <img src={iconSearch} alt="검색"/>
                        </button>
                    </div>
                </div>
                {userId && (
                    <div className="container result">
                        <ul className="badge-list">
                            {weeklyParticipation.map((participated, index) => (
                                <li key={index} className="badge">
                                    <p>{index + 1}주차</p>
                                    <span>({dateStrings[index]})</span>
                                    <div className={`progress-box ${participated ? 'success' : ''}`}>
                                        <CircularProgressbarWithChildren
                                            value={weeklyCounts[index]}
                                            maxValue={index === 4 ? 10 : 5} // 5주차는 10권
                                            styles={{
                                                path: {
                                                    stroke: '#87B5F1',
                                                    strokeLinecap: 'round',
                                                    strokeWidth: '3',
                                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                                    transformOrigin: 'center center',
                                                },
                                                trail: {
                                                    stroke: '#ECEDF0',
                                                    strokeLinecap: 'butt',
                                                    transform: 'rotate(0.25turn)',
                                                    transformOrigin: 'center center',
                                                    strokeWidth: '3',
                                                }
                                            }}
                                        >
                                            <img style={{width: "80%"}} className={participated ? "success-img" : ""}
                                                 src={participated ? wigerImages[index] : wigerBook} alt="wiger"/>
                                        </CircularProgressbarWithChildren>
                                        {participated ? <p>완료</p> : ""}

                                    </div>
                                    {/*<span>({weeklyCounts[index]}/5)</span>*/}

                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
            {/* result section end */}

            {/* footer start */}
            <footer>
                <p>41527 대구광역시 북구 복현로 35 (복현2동 218)</p>
                <p>도서관 사무실 : 053-940-5152 / 자료실 : 053-940-5153</p>
                <p>Copyright 2024 YEUNGJIN UNIVERSITY. All rights reserved.</p>
                <img src={logo} alt="yjulib"/>
            </footer>
            {/* footer end */}
        </div>
    );
};

export default Library;
