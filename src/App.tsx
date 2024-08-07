import React, { useState, useEffect } from "react";
import { ReactComponent as Dice } from "./images/icon-dice.svg";
import axios from "axios";
import { gsap } from "gsap";
import { ReactComponent as Divider } from "./images/pattern-divider-desktop.svg";
import { ReactComponent as DividerMobile } from "./images/pattern-divider-mobile.svg";

interface AdviceResponse {
  slip: {
    id: number;
    advice: string;
  };
}

function App() {
  const [advice, setAdvice] = useState<string>("");
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvice, setShowAdvice] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(window.innerWidth);

  const getAdvice = async (): Promise<void> => {
    setError(null);
    setShowAdvice(false);
    try {
      const response = await axios.get<AdviceResponse>(
        `https://api.adviceslip.com/advice`,
        { timeout: 5000 }
      );
      setAdvice(response.data.slip.advice);
      setCurrentId(response.data.slip.id);

      setShowAdvice(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setError("Request timed out. Please try again.");
        } else {
          setError("Could not fetch advice. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error :", error);
    }
  };
  useEffect(() => {
    if (showAdvice) {
      gsap.fromTo(
        ".adviceContainer",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power1.out" }
      );
    }
    if (advice) {
      gsap.fromTo(
        ".divider",
        { y: 100, opacity: 0, scale: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 2, ease: "power1.inOut" }
      );
    }
  }, [showAdvice]);
  const handleClick = () => {
    gsap.fromTo(
      ".dice",
      { rotation: 0 },
      { rotation: 1080, duration: 1.5, ease: "power1.inOut" }
    );

    gsap.from(".container", {
      backgroundColor: "#202632",

      opacity: 0,
      scale: 0.5,
      duration: 1,
      ease: "power1.inOut",
    });
    gsap.to(".container", {
      backgroundColor: "#313a49",
      opacity: 1,
      duration: 1,
      ease: "power1.inOut",
      scale: 1.05,
      yoyo: true,
    });

    getAdvice();
  };

  useEffect(() => {
    getAdvice();
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {showAdvice && advice && (
        <div className="adviceContainer">
          <div className="adviceNumber">ADVICE #{currentId}</div>
          <p className="advice">"{advice}"</p>
        </div>
      )}
      <div className="divider">
        {width > 768 ? <Divider /> : <DividerMobile />}
      </div>
      <button
        onClick={handleClick}
        onMouseEnter={() =>
          gsap.to(".dice", { scale: 1.2, duration: 0.3, ease: "power1.out" })
        }
        onMouseLeave={() =>
          gsap.to(".dice", { scale: 1, duration: 0.3, ease: "power1.in" })
        }
      >
        <Dice className="dice" />
      </button>
    </div>
  );
}

export default App;
