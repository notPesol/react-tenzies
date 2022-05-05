
export default function Dice({value, isHeld, holdDice}) {
    return (
        <div 
            className={`box ${isHeld && 'held'}`}
            onClick={holdDice}>
            <h2>{value}</h2>
        </div>
    )
}