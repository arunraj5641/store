const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[#1F2937]/60 ${className}`.trim()}
      {...props}
    />
  )
}

export default Skeleton
