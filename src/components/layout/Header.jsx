export default function Header({ onMenu }) {
  return (
    <div className="mob-bar">
      <div className="mob-logo">🛩 SatPilot</div>
      <button className="mob-menu" onClick={onMenu}>☰</button>
    </div>
  )
}
