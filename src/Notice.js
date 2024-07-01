import React from "react";

import gift1 from './assets/images/gift1.jpg';
import gift2 from './assets/images/gift2.png';
import gift3 from './assets/images/gift3.jpg';
import gift4 from './assets/images/gift4.jpg';
import gift5 from './assets/images/gift5.png';
import gift7 from './assets/images/gift7.jpg';

const Notice = () => {
    return (
        <section className="notice">
            <div className="container">
                <p className="title">· 참여 방법 ·</p>
                <p>전자책(E-BOOK) 대출 시 자동 응모!</p>
                <p className="red">(※각 주차별 시작시 대출 권수 리셋, 당일대출 당일반납 시 대출권수 미인정)</p>
                <a href="https://ebook.yjc.ac.kr/" target="_blank">전자도서관 바로 가기</a>
                <p className="title">· 미션 안내 ·</p>
                <div className="mission-box">
                    <div className="mission">
                        <div className="mission-date">
                            <p>1주차 미션</p>
                            <span>7/8 ~ 7/14</span>
                        </div>
                        <img src={gift1} alt="휴대용칫솔치약"/>
                        <div className="mission-desc">
                            <p>전자도서</p>
                            <p>5권 이상 대출</p>
                            <span>휴대용 치약칫솔세트 (5명)</span>
                        </div>
                    </div>
                    <div className="mission">
                        <div className="mission-date">
                            <p>2주차 미션</p>
                            <span>7/15 ~ 7/21</span>
                        </div>
                        <img src={gift2} alt="핸디선풍기"/>
                        <div className="mission-desc">
                            <p>전자도서</p>
                            <p>5권 이상 대출</p>
                            <span>춘식이 핸디 선풍기 (5명)</span>
                        </div>
                    </div>
                    <div className="mission">
                        <div className="mission-date">
                            <p>3주차 미션</p>
                            <span>7/22 ~ 7/28</span>
                        </div>
                        <img src={gift3} alt="BHC뿌링클"/>
                        <div className="mission-desc">
                            <p>전자도서</p>
                            <p>5권 이상 대출</p>
                            <span>BHC 뿌링클 치킨 (5명)</span>
                        </div>
                    </div>
                    <div className="mission">
                        <div className="mission-date">
                            <p>4주차 미션</p>
                            <span>7/29 ~ 8/4</span>
                        </div>
                        <img src={gift4} alt="레디백미니캐리어"/>
                        <div className="mission-desc">
                            <p>전자도서</p>
                            <p>5권 이상 대출</p>
                            <span>레디백 미니 캐리어 (5명)</span>
                        </div>
                    </div>
                    <div className="mission">
                        <div className="mission-date">
                            <p>5주차 미션</p>
                            <span>8/5 ~ 8/16</span>
                        </div>
                        <img src={gift5} alt="레고트텀블러"/>
                        <div className="mission-desc">
                            <p>전자도서</p>
                            <p><span className="highlight">10권 이상</span> 대출</p>
                            <span>오덴세 레고트 텀블러 (5명)</span>
                        </div>
                    </div>
                </div>
                <div className="plus">
                    <div></div>
                    <div></div>
                </div>
                <div className="sub-mission-box">
                    <div className="sub-mission">
                        <div className="mission-desc">
                            <p>챌린지 미션 <span className="highlight">3번 이상</span> 성공시</p>
                            <span>도서관 기념품 보조배터리 (전원)</span>
                        </div>
                    </div>
                    <div className="sub-mission">
                        <div className="mission-desc">
                            <p>챌린지 미션 <span className="highlight">전부</span> 성공시</p>
                            <span>올리브영 기프트카드 1만 원권 (전원)</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Notice;