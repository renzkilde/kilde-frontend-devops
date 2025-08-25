import Explore_kilde from '../../Assets/Images/explore_kilde_img.avif'
import Indiviudal_Investor from '../../Assets/Images/SVGs/individual.svg';
import Family_Office from '../../Assets/Images/SVGs/family_office.svg';
import Mont_Kilde_Fund from '../../Assets/Images/SVGs/mont_kilde_fund.svg';
import ChatCenteredDots from '../../Assets/Images/SVGs/ChatCenteredDots.svg';
import BlogImg from '../../Assets/Images/SVGs/Blog_img.png';
import Statistic from '../../Assets/Images/SVGs/statistic.svg';
import Security from '../../Assets/Images/SVGs/security.svg';
import right_black_arrow from "../../Assets/Images/Icons/right_black_arrow.svg";
import right_black from "../../Assets/Images/SVGs/right_black.svg";
import right_blue_arrow from "../../Assets/Images/SVGs/right_blue.svg";

import "./NewAuthLayoutStyle.css";
import { COMPANY, INSIGHTS, INVESTOR_CATEGORY, PLATFORM, WHY_KILDE } from '../../Utils/Constant';


const NavDropdown = ({ type, openResponsive, setOpenResponsive }) => {


    const investMenu = (
        <div className="mega-menu">
            <div className="mega-menu-column-wrapper">
                <div className="invest-menu-column cursor-pointer" onClick={() => window.location.href = INVESTOR_CATEGORY.INDIVIDUAL}>
                    <img src={Indiviudal_Investor} alt='Indiviudal_Investor' />
                    <div className='flex-column-5'>
                        <div className='d-flex align-center gap-4'>
                            <h4 className="menu-heading">
                                Individual Investors
                            </h4>
                            <img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' />
                        </div>
                        <p className="menu-description">
                            We make it easy for institutions and individuals to invest in private debt.
                        </p>
                    </div>
                </div>
                <div className="vertical-divider"></div>
            </div>

            <div className="mega-menu-column-wrapper">
                <div className="invest-menu-column cursor-pointer" onClick={() => window.location.href = INVESTOR_CATEGORY.FAMILY_OFFICE}>
                    <img src={Family_Office} alt='Family_Office' />
                    <div className='flex-column-5'>
                        <div className='d-flex align-center gap-4'>
                            <h4 className="menu-heading">
                                Family Office
                            </h4>
                            <img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' />
                        </div>
                        <p className="menu-description">
                            Secure High-Yield Private Credit Investments, Backed by AI-Driven Risk Analysis.
                        </p>
                    </div>
                </div>
                <div className="vertical-divider"></div>
            </div>

            <div className="mega-menu-column-wrapper">
                <div className="invest-menu-column cursor-pointer" onClick={() => window.location.href = INVESTOR_CATEGORY.MONT_KILDE_FUND}>
                    <img src={Mont_Kilde_Fund} alt='Mont_Kilde_Fund' />
                    <div className='flex-column-5'>

                        <div className='d-flex align-center gap-4'>
                            <h4 className="menu-heading">
                                Mont Kilde Fund
                            </h4>
                            <img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' />
                        </div>
                        <p className="menu-description">
                            High-Yield Private Credit for Non-Bank Financial Institutions in Emerging Markets.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );


    const whyKildeMenu = (
        <div className="mega-menu">
            <div className='flex-column-20'>
                <h4 className="new-header-sub-heading">Investing Benefits</h4>
                <ul>
                    <li className='li-with-arrow'>
                        <div className='d-flex align-center gap-4'>
                            <a href={WHY_KILDE.BEAT_INFLATION}>Beat Inflation</a>
                            <img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' />
                        </div>
                    </li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={WHY_KILDE.MONTHLY_INCOME}>Monthly Passive income</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={WHY_KILDE.PUT_IDLE_MONEY_TO_WORK}>Put Idle Cash to Work</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={WHY_KILDE.PORTFOLIO_RETURN}>Smoothen Portfolio Returns</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={WHY_KILDE.IMPACT_ON_LIVES}>Make an Impact on Lives</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                </ul >
            </div >

            <div className='flex-column-20'>
                <h4 className="new-header-sub-heading">Compare Kilde</h4>
                <ul>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={WHY_KILDE.COMPARE_KILDE}>Kilde vs Endowus</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={WHY_KILDE.KILDE_VS_SYFE}>Kilde vs Syfe</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={WHY_KILDE.KILDE_VS_CHOCOLATE}>Kilde vs Chocolate Finance</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={WHY_KILDE.KILDE_VS_SYFE}>Kilde vs StashAway</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                </ul>
            </div>

            <div className="right-section">
                <div className="menu-card cursor-pointer" onClick={() => window.location.href = WHY_KILDE.STATISTICS}>
                    <div className="icon-box"><img src={Statistic} alt='Statistic' className='why-img' /></div>
                    <div className='flex-column-5'>
                        <p className='why-kilde-head'>Statistics</p>
                        <p className='why-kilde-desc'>Dive into data on yield, defaults, and real-world investor outcomes.</p>
                    </div>
                </div>

                <div className="menu-card cursor-pointer" onClick={() => window.location.href = WHY_KILDE.SECURITY}>
                    <div className="icon-box"><img src={Security} alt='Security' className='why-img' /></div>
                    <div className='flex-column-5'>
                        <p className='why-kilde-head'>Security</p>
                        <p className='why-kilde-desc'>Understand the safeguards built into every investment on Kilde.</p>
                    </div>
                </div>
            </div>
        </div >
    );


    const PlatformMenu = (
        <div className="mega-menu">
            <div className='flex-column-20'>
                <h4 className="new-header-sub-heading">Platform</h4>
                <ul className='new-header-ul'>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={PLATFORM.HOW_WORK}>How it works</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={PLATFORM.FAQ}>FAQ</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={PLATFORM.GLOSSARY}>Glossary</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={PLATFORM.FOR_BORROWER}>For Borrowers</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                </ul>
            </div>
            <div className="right-section cursor-pointer" onClick={() => setOpenResponsive(true)}>
                <div className="menu-card explore-img-div">
                    <img
                        src={Explore_kilde}
                        alt="Explore_kilde"
                        className="menu-card-image"
                    />
                </div>
                <div>
                    <h5 className="card-title">Explore Kilde</h5>
                    <p className="card-description">
                        Understand the safeguards built into every investment on Kilde.
                    </p>
                </div>
            </div>
        </div>
    );


    const CompanyMenu = (
        <div className="mega-menu company-menu">
            <div className='flex-column-20'>
                <h4 className="new-header-sub-heading">Company</h4>
                <ul>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={COMPANY.ABOUT}>About Kilde</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={COMPANY.TEAM}>Our Team</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                </ul>
            </div>
            <div className="company-menu-column right-section">
                <div className="company-menu-card">
                    <div className="company-card-icon">
                        <img src={ChatCenteredDots} alt="Chat Icon" />
                        <div>
                            <h5 className="card-title">Connect with Us</h5>
                            <p className="card-description">
                                Speak to our team for personalised guidance and recommendations.
                            </p>
                        </div>
                    </div>

                    <button className="contact-btn cursor-pointer" onClick={() => window.location.href = COMPANY.CONTACT}>
                        <span className="contact-text">Contact us</span>
                        <span className="arrow">
                            <img src={right_black} alt="rightarrow" className="arrow-default" />
                            <img src={right_blue_arrow} alt="rightarrow-blue" className="arrow-hover" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );

    const InsightsMenu = (
        <div className="mega-menu">
            <div className='flex-column-20'>
                <h4 className="new-header-sub-heading">Grow Your Knowledge</h4>
                <ul>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={INSIGHTS.BASIC_INVESTING}>Basics of Investing</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={INSIGHTS.REVIEW}>Reviews & Comparisons</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                </ul>
            </div>

            <div className='flex-column-20'>
                <h4 className="new-header-sub-heading">Media & Updates</h4>
                <ul>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={INSIGHTS.INSIGHT}>Our Insights</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={INSIGHTS.KILDE_PRESS}>Kilde in the Press</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                    <li className='li-with-arrow'><div className='d-flex align-center gap-4'><a href={INSIGHTS.VIDEO_HUB}>Video Hub</a><img src={right_black_arrow} alt="right arrow" className='right-arrow-for-menu' /></div></li>
                </ul>
            </div>
            <div className="right-section">
                <h4 className="new-header-sub-heading">Featured blogpost
                </h4>
                <div className="menu-card explore-img-div cursor-pointer" onClick={() => window.location.href = INSIGHTS.BLOG_POST}>
                    <img
                        src={BlogImg}
                        alt="Explore Kilde: A Smarter Way to Invest"
                        className="menu-card-image"
                    />
                </div>
                <div className='cursor-pointer' onClick={() => window.location.href = INSIGHTS.INSIGHTS.BLOG_POST}>
                    <h5 className="card-title">Explore Kilde</h5>
                    <p className="card-description">
                        Czech Republic’s Non-Bank Lending Landscape: Traditional, Digital,
                        and Fintech Convergence
                    </p>
                </div>
            </div>
        </div>
    );


    if (type === "invest") {
        return <div className="why-kilde-nav-dropdown">{investMenu}</div>;
    }

    if (type === "whyKilde") {
        return <div className="why-kilde-nav-dropdown">{whyKildeMenu}</div>;
    }
    if (type === "platform") {
        return <div className="why-kilde-nav-dropdown">{PlatformMenu}</div>;
    }
    if (type === "company") {
        return <div className="company-kilde-nav-dropdown">{CompanyMenu}</div>;
    }
    if (type === "insights") {
        return <div className="company-kilde-nav-dropdown">{InsightsMenu}</div>;
    }



    return null;
};

export default NavDropdown;

