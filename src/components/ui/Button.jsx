export default function Button({ children, variant='dk', size='md', onClick, disabled, className='', style={} }) {
  const base = 'btn'
  const variants = { dk:'btn-dk', g:'btn-g', out:'btn-out' }
  const sizes    = { md:'', sm:'btn-sm' }
  return (
    <button
      className={`${base} ${variants[variant]||''} ${sizes[size]||''} ${className}`}
      style={style} onClick={onClick} disabled={disabled}
    >{children}</button>
  )
}
