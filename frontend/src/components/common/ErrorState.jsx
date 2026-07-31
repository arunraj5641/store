const ErrorState = ({ title = 'Something went wrong', description = 'Please try again later.' }) => {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-300">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  )
}

export default ErrorState
