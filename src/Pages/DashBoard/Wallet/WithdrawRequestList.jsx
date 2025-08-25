import { Table, Spin } from "antd";
// import DotsThree from "../../../Assets/Images/Icons/Dashboard/DotsThree.svg";
// import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import { britishFormatDate } from "../../../Utils/Helpers";
// import {
//   CancelWithdrawalApi,
//   GetWithdrawalRequestListApi,
// } from "../../../Apis/WalletApi";
// import { setWithdrawRequestList } from "../../../Redux/Action/Wallet";
// import { useDispatch } from "react-redux";
// import { walletWithdrawRequestListTooltipContent } from "../TooltopContent";
// import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";
import {
  formatCurrency,
  // showMessageWithCloseIcon,
  // showMessageWithCloseIconError,
} from "../../../Utils/Reusables";

const WithdrawRequestList = ({
  withdrawalRequestList,
  isWithdrawalRequestLoading,
  // setIsWithdrawalRequestLoading,
}) => {
  // const dispatch = useDispatch();
  // const [cancelWithdrawModal, setCancelWithdrawModal] = useState(false);
  // const [popoverOpenStates, setPopoverOpenStates] = useState([]);
  // const [cancelWithdrawRequestId, setCancelWithdrawRequestId] = useState();
  // const [cancelWithdrawRequestLoader, setCancelWithdrawRequestLoader] =
  // useState(false);

  // const user = useSelector((state) => state.user);
  // const handleOpenChange = (index, newOpen) => {
  //   const updatedStates = [...popoverOpenStates];
  //   updatedStates[index] = newOpen;
  //   setPopoverOpenStates(updatedStates);
  // };

  // const handleCancelWithdraw = (index, payoutId) => {
  //   setCancelWithdrawRequestId(payoutId);
  //   setCancelWithdrawModal(true);
  //   const updatedStates = [...popoverOpenStates];
  //   updatedStates[index] = false;
  //   setPopoverOpenStates(updatedStates);
  // };

  // const getPopoverContent = (index, payoutId) => {
  //   return (
  //     <div>
  //       <Button
  //         className="withraw-cancelbtn"
  //         onClick={() => handleCancelWithdraw(index, payoutId)}
  //       >
  //         Cancel
  //       </Button>
  //     </div>
  //   );
  // };

  // const handleCancelWithdrawalRequest = async () => {
  //   setCancelWithdrawRequestLoader(true);
  //   const data = {
  //     payoutId: cancelWithdrawRequestId,
  //   };

  //   try {
  //     const response = await CancelWithdrawalApi(data);
  //     if (Object.keys(response)?.length > 0) {
  //       setCancelWithdrawRequestLoader(false);
  //     } else {
  //       showMessageWithCloseIcon("Withdrawal request cancelled successfully");
  //       setCancelWithdrawModal(false);
  //       getWithdrawalRequestList();
  //       setCancelWithdrawRequestLoader(false);
  //     }
  //   } catch (error) {
  //     showMessageWithCloseIconError(error?.message);
  //     setCancelWithdrawRequestLoader(false);
  //     throw error;
  //   }
  // };

  // const getWithdrawalRequestList = async () => {
  //   setIsWithdrawalRequestLoading(true);
  //   const filterPayload = {
  //     page: 1,
  //     pageSize: 2,
  //   };

  //   try {
  //     const response = await GetWithdrawalRequestListApi(filterPayload);
  //     if (response) {
  //       setWithdrawRequestList(response?.requests, dispatch);
  //       setIsWithdrawalRequestLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching withdrawal request list data:", error);
  //     setIsWithdrawalRequestLoading(false);
  //     return null;
  //   }
  // };

  const withDrawColumns = [
    {
      title: "Requested date",
      dataIndex: "RequestedDate",
    },
    {
      title: "Amount ",
      dataIndex: "Amount",
    },
    {
      title: "Currency ",
      dataIndex: "Currency",
    },
    {
      title: "Status ",
      dataIndex: "Status",
    },
    // {
    //   title: " ",
    //   dataIndex: "Dots",
    // },
  ];

  const withDrawData =
    withdrawalRequestList?.length > 0 &&
    withdrawalRequestList?.map((request, index) => ({
      key: request.key,
      RequestedDate: britishFormatDate(request.requestDate),
      Amount: formatCurrency("", request?.amount),
      Currency: request.currencyCode,
      Status:
        request.status === "PENDING" ? (
          <div className="withdraw-status-div">
            <span className="progress-circle-span"></span>
            <p className="progress-p">Pending</p>
          </div>
        ) : request.status === "SETTLED" ? (
          <div className="withdraw-status-div">
            <span className="settled-circle-span"></span>
            <p className="settled-p">Processed</p>
          </div>
        ) : request.status === "EXPORTED" ? (
          <div className="withdraw-status-div">
            <span className="progress-circle-span"></span>
            <p className="progress-p">Processing</p>
          </div>
        ) : request.status === "FAILED" ? (
          <div className="withdraw-status-div">
            <span className="failed-circle-span"></span>
            <p className="failed-p">Failed</p>
          </div>
        ) : request.status === "ON_HOLD" ? (
          <div className="withdraw-status-div">
            <span className="progress-circle-span"></span>
            <p className="progress-p">Under Review</p>
          </div>
        ) : request.status === "SENT" ? (
          <div className="withdraw-status-div">
            <span className="progress-circle-span"></span>
            <p className="progress-p">Processing</p>
          </div>
        ) : (
          <div className="withdraw-status-div">
            <span className="failed-circle-span"></span>
            <p className="failed-p">Cancelled</p>
          </div>
        ),
      // Dots:
      //   user?.vwoFeatures?.wallet?.showCancelWithdrawRequests === true &&
      //   request.status === "PENDING" ? (
      //     <Popover
      //       placement="rightBottom"
      //       content={getPopoverContent(index, request.payoutId)}
      //       open={popoverOpenStates[index]}
      //       onOpenChange={(newOpen) => handleOpenChange(index, newOpen)}
      //     >
      //       <Button className="dotsThreeBtn">
      //         <img src={DotsThree} alt="three_dot" />
      //       </Button>
      //     </Popover>
      //   ) : null,
    }));

  return (
    <div>
      <Table
        columns={withDrawColumns}
        dataSource={withDrawData}
        className="trache-table outstanding-pay-table"
        scroll={{ x: "auto" }}
        pagination={false}
        loading={
          isWithdrawalRequestLoading
            ? {
                indicator: (
                  <div>
                    <Spin />
                  </div>
                ),
              }
            : false
        }
      />

      {/* <Modal
        centered
        open={cancelWithdrawModal}
        onCancel={() => {
          setCancelWithdrawModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to cancel withdrawal request?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setCancelWithdrawModal(false);
            }}
          >
            Back
          </Button>
          <ButtonDefault
            style={{ width: "100%" }}
            title="Cancel"
            onClick={handleCancelWithdrawalRequest}
            loading={cancelWithdrawRequestLoader}
          />
        </div>
      </Modal> */}
    </div>
  );
};

export default WithdrawRequestList;
