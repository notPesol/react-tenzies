import { useEffect, useState } from "react";
import Dice from "./components/Dice";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {

    const [dices, setDices] = useState(() => allNewDice());

    const [tenzies, setTenzies] = useState(() => false);

    const [time, setTime] = useState(0);

    const [bestTime, setBestTime] = useState(() => localStorage.getItem("bestTime") || 0);

    function allNewDice() {
        const arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push(generateNewDice());
        }
        return arr;
    }

    function generateNewDice() {
        return {
            id: nanoid(),
            value: Math.floor(Math.random() * 6) + 1,
            isHeld: false
        }
    }

    function rollDice() {
        if (tenzies) {
            setDices(allNewDice());
            setTenzies(false);
            setTime(0);
        } else {
            setDices(prevDices => prevDices.map(die => {
                return die.isHeld ? die : generateNewDice()
            }));
            setTime(prevTime => prevTime + 1);
        }
    }

    function holdDice(id) {
        setDices(prevDices => prevDices.map(die => {
            return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
        }))
    }

    useEffect(() => {
        function checkWinner() {
            return dices.every(dice => dice.isHeld && dice.value === dices[0].value);
        }

        if (checkWinner()) {
            setTenzies(true);
            if (bestTime === 0 || time < bestTime) {
                setBestTime(time);
                localStorage.setItem("bestTime", time);
            }
        }
    }, [dices])

    const dicesElement = dices.map((dice) => (
        <Dice key={dice.id} value={dice.value} isHeld={dice.isHeld} holdDice={() => holdDice(dice.id)} />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <h1>Tenzies</h1>
            <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="boxes">
                {dicesElement}
            </div>
            <button onClick={rollDice}>{tenzies ? 'New Game' : 'Roll'}</button>
            <p>Roll time : {time}</p>
            {bestTime > 0 && <h3>Best time : {bestTime}</h3>}
        </main>
    );
}