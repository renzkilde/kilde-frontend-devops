import React from 'react';
import { Skeleton, Col, Row, Table } from 'antd';

const TranchInvestInfoSkeleton = () => {
    return (
        <Col className="gutter-row mt-24 mb-24" lg={24} md={24} sm={24} xs={24}>
            <Row>
                <Col
                    sm={24}
                    md={24}
                    lg={24}
                    className="gutter-row infomation-div"
                    style={{ flex: 1 }}
                >
                    <Row
                        className="sub-info-div sb-text-align"
                        gutter={40}
                        style={{ textAlign: "justify" }}
                    >
                        <Col
                            xs={24}
                            sm={6}
                            md={6}
                            className="sing-col gutter-row sub-info-invest-col"
                        >
                            <Skeleton active paragraph={false} title={{ width: 100 }} />
                            <Skeleton.Input active style={{ width: 100, height: 24 }} />
                        </Col>
                        <Col
                            xs={24}
                            sm={6}
                            md={6}
                            className="sing-col gutter-row media-invest-col"
                        >
                            <Skeleton active paragraph={false} title={{ width: 80 }} />
                            <Skeleton.Input active style={{ width: 60, height: 24 }} />
                        </Col>
                        <Col
                            xs={24}
                            sm={6}
                            md={6}
                            className="sing-col gutter-row media-invest-col"
                        >
                            <Skeleton active paragraph={false} title={{ width: 100 }} />
                            <Skeleton.Input active style={{ width: 120, height: 24 }} />
                        </Col>
                        <Col
                            xs={24}
                            sm={6}
                            md={6}
                            className="last-sing-col gutter-row media-invest-col"
                        >
                            <Skeleton active paragraph={false} title={{ width: 80 }} />
                            <Skeleton.Input active style={{ width: 80, height: 24 }} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );
};

const OverviewAndBondSkeleton = () => {
    return (
        <Row
            gutter={[16, 16]}
            className="mt-24 business-div business-description"
        >
            <Col xs={24} md={14}>
                <div className="infomation-div">
                    <Skeleton
                        active
                        title={{ width: "30%" }}
                        paragraph={{ rows: 2, width: ["90%", "95%"] }}
                        className="mb-24"
                    />
                    <Skeleton.Image
                        active
                        className="borrower-img-skeleton"
                        style={{
                            width: "100%",
                            height: 240,
                            objectFit: "cover",
                        }}
                    />
                </div>
            </Col>
            <Col xs={24} md={10}>
                <div className="infomation-div">
                    <Skeleton
                        active
                        title={{ width: "40%" }}
                        paragraph={{
                            rows: 8,
                            width: [
                                "80%",
                                "100%",
                                "85%",
                                "90%",
                                "95%",
                                "80%",
                                "70%",
                                "60%",
                            ],
                        }}
                    />
                </div>
            </Col>
        </Row>
    );
};

const StartInvestingAndInvestmentSkeleton = () => {
    return (

        <Row gutter={[16, 16]} className="mb-24 media-borrower-b-row t-desc-div invest mt-24">
            <Col xs={24} md={12}>
                <div
                    className="infomation-div p-relative"
                    style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                            <Skeleton.Avatar size="small" shape="circle" style={{ marginRight: 8 }} active />
                            <Skeleton.Input style={{ width: '40%', height: 20 }} active />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Skeleton.Input style={{ width: '50%', height: 18 }} active />
                            <Skeleton.Button style={{ width: 100, height: 30 }} active />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <Skeleton.Input active block style={{ height: 45, borderRadius: 8 }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                        <Skeleton.Button
                            active
                            style={{ width: 80, height: 40, borderRadius: 8 }}
                        />
                    </div>
                </div>
            </Col>

            <Col xs={24} md={12}>
                <div
                    className="infomation-div"
                    style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    <Skeleton
                        active
                        title={{ width: "30%" }}
                        paragraph={{ rows: 1, width: ["90%", "95%"] }}
                        className="mb-24"
                    />
                </div>
            </Col>
        </Row>
    );
};

const BusinessAndDocumentsSkeleton = () => {
    return (
        <Row
            gutter={[16, 16]}
            className="mt-24 business-div business-description"
            style={{ alignItems: 'stretch' }}
        >
            <Col sm={24} md={14} lg={14} className="gutter-row">
                <div
                    className="infomation-div"
                    style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                    <Row>
                        <Col md={24} className="mb-24">
                            <Skeleton paragraph={{ rows: 2, width: ['100%', '90%', '95%', '80%'] }} active />
                        </Col>
                        <Col xs={24} style={{ marginTop: 20 }}>
                            <Row gutter={[0, 8]}>
                                <Col xs={12} lg={12}><Skeleton.Input style={{ width: 100, height: 18 }} active /></Col>
                                <Col xs={12} lg={12}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                                        <Skeleton.Avatar shape="square" size={24} active />
                                        <Skeleton.Avatar shape="square" size={24} active />
                                        <Skeleton.Avatar shape="square" size={24} active />
                                        <Skeleton.Avatar shape="square" size={24} active />
                                    </div>
                                </Col>
                                {[...Array(6)].map((_, i) => (
                                    <React.Fragment key={i}>
                                        <Col xs={12} lg={12}><Skeleton.Input style={{ width: '70%', height: 18 }} active /></Col>
                                        <Col xs={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Skeleton.Input style={{ width: '50%', height: 18 }} active />
                                        </Col>
                                    </React.Fragment>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Col>

            <Col xs={24} sm={24} md={10} lg={10} className="gutter-row medium-tranch-col">
                <div
                    className="infomation-div"
                    style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                    <div>
                        <Skeleton active paragraph={{ rows: 1, width: ['100%', '80%'] }} />

                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 12
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Skeleton.Avatar shape="square" size="small" style={{ marginRight: 8 }} active />
                                    <Skeleton.Input style={{ width: 150, height: 18 }} active />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Skeleton.Avatar shape="circle" size="small" active />
                                    <Skeleton.Avatar shape="square" size="small" active />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Skeleton.Button style={{ width: 100, marginTop: 16 }} active />
                </div>
            </Col>
        </Row>
    );
};

const DealStructureSkeleton = () => (
    <Row className="mt-24 media-borrower-t-row">
        <Col xs={24} md={24}>
            <div className="infomation-div" style={{ padding: 16 }}>
                <Skeleton active paragraph={false} title={{ width: 80 }} />
                <Skeleton active paragraph={{ rows: 1, width: ['100%', '80%'] }} />
            </div>
        </Col>
    </Row>
);

const DealMonitoringTableSkeleton = () => {
    const numRows = 3;

    const data = Array.from({ length: numRows }).map((_, i) => ({
        key: i,
        col0: <Skeleton.Input size="small" style={{ width: '60px' }} active />, // Year-Q
        col1: <Skeleton.Input size="small" style={{ width: '40px' }} active />,
        col2: <Skeleton.Input size="small" style={{ width: '40px' }} active />,
        col3: <Skeleton.Input size="small" style={{ width: '40px' }} active />,
        col4: <Skeleton.Input size="small" style={{ width: '80px' }} active />,
        col5: <Skeleton.Input size="small" style={{ width: '80px' }} active />,
        col6: <Skeleton.Input size="small" style={{ width: '80px' }} active />,
    }));

    const skeletonColumns = [
        {
            title: <Skeleton.Input size="small" style={{ width: '30px' }} active />,
            dataIndex: 'col0',
            key: 'col0',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        {
            title: <Skeleton.Input size="small" style={{ width: '80px' }} active />,
            dataIndex: 'col1',
            key: 'col1',
            responsive: ['sm', 'md', 'lg', 'xl'],
        },
        {
            title: <Skeleton.Input size="small" style={{ width: '70px' }} active />,
            dataIndex: 'col2',
            key: 'col2',
            responsive: ['sm', 'md', 'lg', 'xl'],
        },
        {
            title: <Skeleton.Input size="small" style={{ width: '90px' }} active />,
            dataIndex: 'col3',
            key: 'col3',
            responsive: ['md', 'lg', 'xl'],
        },
        {
            title: <Skeleton.Input size="small" style={{ width: '100px' }} active />,
            dataIndex: 'col4',
            key: 'col4',
            responsive: ['lg', 'xl'],
        },
    ];

    return (
        <div className="infomation-div" style={{ padding: 16 }}>
            <Skeleton.Input style={{ width: '30%', height: 24, marginBottom: 20 }} active />
            <Table
                loading={true}
                columns={skeletonColumns}
                dataSource={data}
                pagination={false}
                className="trache-table outstanding-pay-table"
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

const HeaderSkeleton = () => (
    <>
        <div
            style={{
                backgroundColor: "#FAF9F6",
                borderRadius: "8px",
            }}
        >
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
                <Skeleton.Input style={{ width: 60 }} active size="small" />
                <Skeleton.Input style={{ width: 100 }} active size="small" />
            </div>

            <div
                className="sb-justify-center-item-center"
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 250px" }}>
                    <Skeleton.Input style={{ width: "100%", maxWidth: 150, marginBottom: 4 }} active size="small" />
                    <Skeleton.Input style={{ width: "100%", maxWidth: 200 }} active size="default" />
                </div>
                <div style={{ flexShrink: 0 }}>
                    <Skeleton.Input
                        style={{
                            width: 126.65,
                            height: 56,
                            borderRadius: 4,
                        }}
                        active
                    />
                </div>
            </div>
        </div>
    </>
);

const ActiveUserBannerSkeleton = () => {
    return (
        <div
            style={{
                borderRadius: "8px",
                margin: "16px 0px 16px 0px",
            }}
        >
            <Skeleton.Input
                className='banner-skeleton'
                active
                size="default"
                style={{ height: 90, borderRadius: 6 }}
            />
        </div>
    );
};

export {
    TranchInvestInfoSkeleton,
    OverviewAndBondSkeleton,
    DealMonitoringTableSkeleton,
    HeaderSkeleton,
    ActiveUserBannerSkeleton,
    StartInvestingAndInvestmentSkeleton,
    BusinessAndDocumentsSkeleton,
    DealStructureSkeleton
};