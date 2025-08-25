import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layout, Row, Col, Table, Pagination, Empty, Button } from "antd";
// import NewCommonFilter from "./NewCommonFilter";
import NewTrancheCard from "./NewTrancheCard";
import SkeletonCard from "./SkeletonCard";
import {
  formatTrancheData,
  Tranchecolumns,
  useSkeletonCountByBreakpoint,
  useWindowWidth,
} from "../../../Utils/Reusables";
import { useSelector } from "react-redux";
import { selectFilterFields } from "./Selector";
import { PastTranchListing, TranchListing } from "../../../Apis/DashboardApi";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { sendGATrancheInvestor } from "../../../Apis/UserApi";
import TrancheSearchSort from "./TrancheSearchSort";
import NewFilterComponent from "./NewFilterComponent";
import ShowNewFilterModal from "./ShowNewFilterModal";
import SlidersHorizontal from "../../../Assets/Images/SlidersHorizontal.svg";
import PromoSection from "../../Settings/PromoSection";
import InvestBanner from "../Investment/InvestBanner";

const { Sider, Content } = Layout;

export const useDebouncedValue = (value, delay) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (value === "") {
      setDebounced("");
      return;
    }
    const timer = setTimeout(() => setDebounced(value), delay || 300);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const NewManualInvestment = ({
  showButtonActive,
  user,
  setShowButtonActive,
  showComponent,
  setShowComponent,
}) => {
  const navigate = useNavigate();
  const {
    fromInterest,
    toInterest,
    currency,
    country,
    dealStatus,
    creditRating,
  } = useSelector(selectFilterFields);
  const [filterModal, setFilterModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedSort, setSelectedSort] = useState(null);
  const [trancheCountry, setTrancheCountry] = useState();
  const [trancheRatings, setTrancheRatings] = useState();
  const [trancheInterest, setTrancheInterest] = useState([]);
  const [trancheSearchVal, setTrancheSearchVal] = useState({
    new: [],
    active: [],
    past: [],
  });
  const [loading, setLoading] = useState({
    new: false,
    active: false,
    past: false,
  });
  const [totalItems, setTotalItems] = useState({
    new: 0,
    active: 0,
    past: 0,
  });
  const [data, setData] = useState({ new: [], active: [], past: [] });
  const fetchedRef = useRef({ new: false, active: false, past: false });

  const windowWidth = useWindowWidth();
  const skeletonArray = Array.from({ length: useSkeletonCountByBreakpoint() });

  const validStatuses = ["new", "active", "past"];

  const statusList = useMemo(() => {
    if (
      dealStatus &&
      dealStatus !== "all" &&
      validStatuses.includes(dealStatus)
    ) {
      return [dealStatus];
    }

    if (showComponent === "all") return ["active", "new"];
    if (showComponent === "deals") return ["new", "active", "past"];
    if (showComponent === "funds") return ["new"];

    return [];
  }, [dealStatus, showComponent]);

  const debouncedSearchValue = useDebouncedValue(searchValue, 300);

  const [paginationMap, setPaginationMap] = useState(() => {
    const initialState = {};
    validStatuses.forEach((status) => {
      initialState[status] = {
        current: 1,
        pageSize:
          showComponent === "all" && (status === "active" || status === "new")
            ? 3
            : 6,
      };
    });
    return initialState;
  });

  const investorClickedTranche = async (payload) => {
    try {
      await sendGATrancheInvestor(payload);
    } catch (error) {
      console.error("Failed to send Tranche view data to GA:", error);
      return null;
    }
  };

  const commonFilters = (overrideTrancheType = null) => {
    const ordering = [];

    if (selectedSort) {
      switch (selectedSort) {
        case "asc":
          ordering.push({ field: "maturity_date", asc: true });
          break;
        case "desc":
          ordering.push({ field: "maturity_date", asc: false });
          break;
        case "credit_desc":
          ordering.push({ field: "credit_rating", asc: false });
          break;
        case "credit_asc":
          ordering.push({ field: "credit_rating", asc: true });
          break;
        default:
          break;
      }
    }

    const filter = {
      ordering,
      trancheType:
        overrideTrancheType ?? (showComponent === "deals" ? "DEAL" : "FUND"),
    };

    if (fromInterest) filter.interestRateFrom = fromInterest;
    if (toInterest) filter.interestRateTo = toInterest;
    if (currency && currency !== "ALL") filter.currencyCode = currency;
    if (country) filter.country = country;
    if (creditRating) filter.creditRating = creditRating;
    if (debouncedSearchValue && debouncedSearchValue.trim() !== "") {
      filter.searchByNameOrId = debouncedSearchValue;
    }
    return filter;
  };

  const sectionMap = useMemo(() => {
    const prefix = showComponent === "funds" ? "Fund" : "Deal";

    return {
      new: { title: `New ${prefix}s`, data: data.new, loading: loading.new },
      active: {
        title: `Active ${prefix}s`,
        data: data.active,
        loading: loading.active,
      },
      past: {
        title: `Past ${prefix}s`,
        data: data.past,
        loading: loading.past,
      },
    };
  }, [data, loading, showComponent]);

  const handlePageChange = (status, page, pageSize) => {
    setPaginationMap((prev) => ({
      ...prev,
      [status]: { current: page, pageSize },
    }));

    switch (status) {
      case "new":
        fetchNewDeals(page, pageSize);
        break;
      case "active":
        fetchActiveDeals(page, pageSize);
        break;
      case "past":
        fetchPastDeals(page, pageSize);
        break;
      default:
        break;
    }
  };

  const mergeUnique = (prev = [], next = []) => {
    const merged = [...prev, ...next];
    return Array.from(new Set(merged));
  };

  const fetchNewDeals = async (page, pageSize) => {
    setLoading((prev) => ({ ...prev, new: true }));
    const filter = {
      ...commonFilters(
        showComponent === "all" || showComponent === "funds"
          ? "FUND"
          : undefined
      ),
      createdDateFrom: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      page,
      pageSize,
    };
    const res = await TranchListing(filter);
    setData((prev) => ({ ...prev, new: res?.items || [] }));
    setTotalItems((prev) => ({ ...prev, new: res?.totalItems || 0 }));
    fetchedRef.current.new = true;
    setLoading((prev) => ({ ...prev, new: false }));
    setTrancheCountry((prev) => mergeUnique(prev, res?.countries || []));
    setTrancheRatings((prev) => mergeUnique(prev, res?.ratings || []));
    setTrancheInterest((prev) => mergeUnique(prev, res?.interestRates || []));
    setTrancheSearchVal((prev) => ({
      ...prev,
      new: res?.searchValues || [],
    }));
  };

  const fetchActiveDeals = async (page, pageSize) => {
    setLoading((prev) => ({ ...prev, active: true }));
    const filter = {
      ...commonFilters(showComponent === "all" ? "DEAL" : undefined),
      includeFundedTranches: false,
      createdDateTo: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      page,
      pageSize,
    };
    const res = await TranchListing(filter);
    setData((prev) => ({ ...prev, active: res?.items || [] }));
    setTotalItems((prev) => ({ ...prev, active: res?.totalItems || 0 }));
    fetchedRef.current.active = true;
    setLoading((prev) => ({ ...prev, active: false }));
    setTrancheCountry((prev) => mergeUnique(prev, res?.countries || []));
    setTrancheRatings((prev) => mergeUnique(prev, res?.ratings || []));
    setTrancheInterest((prev) => mergeUnique(prev, res?.interestRates || []));
    setTrancheSearchVal((prev) => ({
      ...prev,
      active: res?.searchValues || [],
    }));
  };

  const fetchPastDeals = async (page, pageSize) => {
    setLoading((prev) => ({ ...prev, past: true }));
    const filter = {
      ...commonFilters(),
      includeFundedTranches: true,
      page,
      pageSize,
    };
    const res = await PastTranchListing(filter);
    setData((prev) => ({ ...prev, past: res?.items || [] }));
    setTotalItems((prev) => ({ ...prev, past: res?.totalItems || 0 }));
    fetchedRef.current.past = true;
    setLoading((prev) => ({ ...prev, past: false }));
    setTrancheCountry((prev) => mergeUnique(prev, res?.countries || []));
    setTrancheRatings((prev) => mergeUnique(prev, res?.ratings || []));
    setTrancheInterest((prev) => mergeUnique(prev, res?.interestRates || []));
    setTrancheSearchVal((prev) => ({
      ...prev,
      past: res?.searchValues || [],
    }));
  };

  const loadData = useCallback(() => {
    const selectedStatuses = statusList;

    if (selectedStatuses.includes("new") && !fetchedRef.current.new) {
      fetchNewDeals(paginationMap.new.current, paginationMap.new.pageSize);
    }
    if (selectedStatuses.includes("active") && !fetchedRef.current.active) {
      fetchActiveDeals(
        paginationMap.active.current,
        paginationMap.active.pageSize
      );
    }
    if (selectedStatuses.includes("past") && !fetchedRef.current.past) {
      fetchPastDeals(paginationMap.past.current, paginationMap.past.pageSize);
    }
  }, [
    showComponent,
    dealStatus,
    fromInterest,
    toInterest,
    currency,
    country,
    creditRating,
    selectedSort,
    debouncedSearchValue,
    paginationMap,
  ]);

  const debouncedLoadData = useMemo(() => debounce(loadData, 300), [loadData]);

  useEffect(() => {
    debouncedLoadData();
    return () => {
      debouncedLoadData.cancel();
    };
  }, [debouncedLoadData, showComponent]);

  useEffect(() => {
    setPaginationMap({
      new: { current: 1, pageSize: 6 },
      active: {
        current: 1,
        pageSize: showComponent === "all" ? 3 : 6,
      },
      past: { current: 1, pageSize: 6 },
    });
    fetchedRef.current = { new: false, active: false, past: false };
  }, [
    fromInterest,
    toInterest,
    currency,
    country,
    creditRating,
    selectedSort,
    searchValue,
    showComponent,
  ]);

  const onSeeAllClick = (status) => {
    if (status === "active") {
      setShowComponent("deals");
    } else {
      setShowComponent("funds");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout className="page-container">
      <Sider
        collapsedWidth="0"
        width={
          windowWidth >= 992 && windowWidth < 1100
            ? 200
            : windowWidth < 900
            ? 220
            : 220
        }
        className="tranche-sidebar"
      >
        <NewFilterComponent
          trancheCountry={trancheCountry}
          newTranchList={data.new}
          activeTrancheList={data.active}
          pastTrancheList={data.past}
          trancheInterest={trancheInterest}
          trancheRatings={trancheRatings}
          showComponent={showComponent}
        />
        <ShowNewFilterModal
          filterModal={filterModal}
          setFilterModal={setFilterModal}
          trancheCountry={trancheCountry}
          newTranchList={data.new}
          activeTrancheList={data.active}
          pastTrancheList={data.past}
          trancheInterest={trancheInterest}
          trancheRatings={trancheRatings}
          showComponent={showComponent}
        />
      </Sider>

      <Layout className="tranche-card-layout">
        <Content>
          <Row
            className={!showButtonActive ? "sb-justify-end-item-center" : null}
          >
            <Col xs={24} className="invest-col">
              <Button
                className="invest-showfilterbutton"
                onClick={() => setFilterModal(true)}
                style={{ height: 36 }}
              >
                Show Filters
                <img src={SlidersHorizontal} alt="img" />
              </Button>
            </Col>
            <Row
              className={!showButtonActive ? "mb-16 w-100" : "w-100"}
              sm={24}
              lg={24}
            >
              <TrancheSearchSort
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                showButtonActive={showButtonActive}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                trancheSearchVal={trancheSearchVal}
                setShowButtonActive={setShowButtonActive}
              />
            </Row>
            {user?.investorStatus === "ACTIVE" &&
            (user?.secondFactorAuth !== null ||
              user?.twoFaCheckEnabled === false) ? (
              <div className="w-100 mt-20">
                <PromoSection user={user} />
              </div>
            ) : null}
            <InvestBanner />
            {!showButtonActive
              ? statusList.map((status) => {
                  const { title, data } = sectionMap[status];
                  const { current, pageSize } = paginationMap[status];

                  if (
                    (status === "new" &&
                      fetchedRef.current.new &&
                      data.length === 0) ||
                    (status === "active" &&
                      fetchedRef.current.active &&
                      data.length === 0) ||
                    (status === "past" &&
                      fetchedRef.current.past &&
                      data.length === 0)
                  ) {
                    return null;
                  }

                  return (
                    <Col xs={24} key={status} className="list-view-div mb-16">
                      <h3 className="mt-0">
                        {showComponent === "all"
                          ? status === "new"
                            ? "Funds"
                            : status === "active"
                            ? "Deals"
                            : title
                          : title}
                      </h3>
                      <div className="table-container">
                        <Table
                          columns={Tranchecolumns}
                          dataSource={formatTrancheData(
                            user,
                            data,
                            navigate,
                            investorClickedTranche
                          )}
                          pagination={false}
                          className="trache-table"
                          loading={
                            loading[status] || !fetchedRef.current[status]
                          }
                          rowKey={(record) =>
                            record.id || record.key || record.name
                          }
                        />
                        {data.length > 0 && (
                          <div className="sb-justify-center-item-center">
                            <div className="text-right mt-12 mb-24">
                              <Pagination
                                className="tranch-table-pagination mb-16"
                                current={current}
                                pageSize={pageSize}
                                total={totalItems[status]}
                                onChange={(page, size) =>
                                  handlePageChange(status, page, size)
                                }
                                // showSizeChanger
                                // pageSizeOptions={["6", "10", "20", "50", "100"]}
                                locale={{ items_per_page: " " }}
                              />
                            </div>
                            {showComponent === "all" && (
                              <div>
                                <Button className="see-all-btn">See All</Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Col>
                  );
                })
              : statusList.map((status, index) => {
                  const { title, data } = sectionMap[status];
                  const { current, pageSize } = paginationMap[status];

                  if (
                    (status === "new" &&
                      fetchedRef.current.new &&
                      data.length === 0) ||
                    (status === "active" &&
                      fetchedRef.current.active &&
                      data.length === 0) ||
                    (status === "past" &&
                      fetchedRef.current.past &&
                      data.length === 0)
                  ) {
                    return null;
                  }

                  return (
                    <Col key={status} xs={24} className="justify-end">
                      <Row className="tranche-sort-head-div mb-20">
                        <Col>
                          <p className="tranche-filter-head mb-0 mt-10">
                            {showComponent === "all"
                              ? status === "new"
                                ? "Funds"
                                : status === "active"
                                ? "Deals"
                                : sectionMap[status]?.title
                              : sectionMap[status]?.title}
                          </p>
                        </Col>
                      </Row>

                      <Row gutter={[20, 20]}>
                        {loading[status] || !fetchedRef.current[status] ? (
                          skeletonArray.map((_, i) => (
                            <Col
                              key={i}
                              xs={24}
                              sm={12}
                              md={12}
                              lg={8}
                              xl={8}
                              xxl={6}
                            >
                              <SkeletonCard />
                            </Col>
                          ))
                        ) : data.length > 0 ? (
                          data.map((deal, i) => (
                            <Col
                              key={i}
                              xs={24}
                              sm={12}
                              md={12}
                              lg={8}
                              xl={8}
                              xxl={6}
                            >
                              <NewTrancheCard
                                tranchInfo={deal}
                                {...(status === "new"
                                  ? { newTranche: true }
                                  : {})}
                                onClickAnalytics={(payload) =>
                                  investorClickedTranche(payload)
                                }
                              />
                            </Col>
                          ))
                        ) : (
                          <Col span={24}>
                            <Empty
                              description={`No ${title.toLowerCase()} available at the moment.`}
                              imageStyle={{ height: 60 }}
                            />
                          </Col>
                        )}
                      </Row>

                      {data.length > 0 && (
                        <div className="sb-justify-center-item-center">
                          <div className="text-right mt-12">
                            <Pagination
                              className="tranch-table-pagination mb-16"
                              current={current}
                              pageSize={pageSize}
                              total={totalItems[status]}
                              onChange={(page, size) =>
                                handlePageChange(status, page, size)
                              }
                              // showSizeChanger
                              // pageSizeOptions={["6", "10", "20", "50", "100"]}
                              locale={{ items_per_page: " " }}
                            />
                          </div>
                          {showComponent === "all" && (
                            <div>
                              <Button
                                className="see-all-btn"
                                onClick={() => onSeeAllClick(status)}
                              >
                                See All
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </Col>
                  );
                })}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewManualInvestment;
