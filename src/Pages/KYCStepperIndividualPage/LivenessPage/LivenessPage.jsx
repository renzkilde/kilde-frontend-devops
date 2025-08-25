import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "antd";
import VideoRecorder from "react-video-recorder";
import Elipse from "../../../Assets/Images/Ellipse.svg";
import { useDispatch, useSelector } from "react-redux";
import { setLivenessDetails } from "../../../Redux/Action/KycIndividual";
import FaceGIF from "../../../Assets/Images/face-scan.gif";

import "./style.css";

const instructions = [
  "Remove any face masks and glasses",
  "Move closer to the camera",
  "Blink three times",
  "Slightly turn your face to the left, then to the right",
  "Look up, then down",
];

const LivenessPage = () => {
  const [state, setState] = useState(0);
  const livenessVideo = useSelector((state) => state.kycIndividual.liveness);
  const webcamRef = useRef(null);
  const dispatch = useDispatch();
  const [instructionIndex, setInstructionIndex] = useState(null); // Control current instruction
  const [isRecording, setIsRecording] = useState(false); // Track if recording is in progress
  const instructionInterval = useRef(null); // Store interval for instructions

  useEffect(() => {
    // Clean up interval when recording is completed
    if (!isRecording) {
      clearInterval(instructionInterval.current);
      setInstructionIndex(null); // Hide instruction after recording
    }
  }, [isRecording]);

  const onClick = (e) => {
    setState(1);
  };

  useEffect(() => {
    if (livenessVideo === "") {
      setState(0);
    }
  }, [livenessVideo]);

  return (
    <div>
      <p className="sb-verification-title">Verify Your Identity</p>
      <p className="mt-0 head-userId">
        You’ll need to record a video for a liveness test, which will be
        compared to your ID photo. AI will verify that you are a real person.
      </p>
      <div className="identify-proof-mainDiv mt-40">
        <p className="kl-pi-subdivtitle" style={{ paddingBottom: "5px" }}>
          Liveness Check
        </p>
        <p className="kl-subtitle mt-0 mb-20">
          Get your camera ready, move left, then right, then up, then down.
        </p>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12} className="gutter-row">
            <div className="sb-liveness-actions-firstdiv">
              {state === 0 ? (
                <div className="sb-liveness-subdiv">
                  <img
                    src={FaceGIF}
                    alt="face-gif"
                    style={{ width: "143px" }}
                  />

                  <div className="sb-liveness-button">
                    <Button
                      style={{ width: 130, height: 40 }}
                      onClick={onClick}
                      className="btn-ready"
                    >
                      I am ready
                    </Button>
                  </div>
                </div>
              ) : state === 1 ? (
                <div className="video-record-div video-container">
                  {/* Video Recorder */}
                  <VideoRecorder
                    isOnInitially={false} // Waits for user to turn on camera
                    showReplayControls={false}
                    onStartRecording={() => {
                      setInstructionIndex(0); // Show first instruction
                      setIsRecording(true); // Start recording
                      let i = 0;
                      instructionInterval.current = setInterval(() => {
                        if (i < instructions.length - 1) {
                          setInstructionIndex((prev) => prev + 1); // Show next instruction
                          i++;
                        } else {
                          clearInterval(instructionInterval.current);
                        }
                      }, 2000); // Show each instruction for 2 sec
                    }}
                    onRecordingComplete={(videoBlob) => {
                      setLivenessDetails(videoBlob, dispatch); // Save video
                      setIsRecording(false); // Stop recording
                    }}
                    muted
                    timeLimit={5000} // Stop after 3 sec
                    ref={webcamRef}
                  />

                  {/* Show instructions only if recording */}
                  {isRecording && instructionIndex !== null && (
                    <div className="instruction-overlay">
                      {instructions[instructionIndex]}
                    </div>
                  )}
                </div>
              ) : (
                <div className="sb-liveness-sucessdiv">
                  <img
                    src={Elipse}
                    alt="LivenessPhoto"
                    className="sb-liveness-image"
                  />

                  <div className="sb-liveness-button">
                    <p className="sb-liveness-success">Scanner Successful!</p>
                    <p className="sb-liveness-content">
                      Face scanning was correctly done.
                      <br /> Please continue this process.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col sm={24} md={24} lg={24} xl={12} className="gutter-row ">
            <div className="sb-liveness-actions">
              <ul className="sb-text-align-start liveness-ul m-0">
                <li>
                  <p className="color-blank">
                    Recommended video duration: 3-5 seconds
                  </p>
                </li>
                <li>
                  <p className="color-blank">
                    Increase your screen to its maximum brightness.
                  </p>
                </li>
                <li>
                  <p className="color-blank">
                    Make sure that your face is not covered with a mask or
                    glasses.
                  </p>
                </li>
                <li>
                  <p className="color-blank">
                    Move to a well-lit place that is not in direct sunlight.
                  </p>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LivenessPage;
