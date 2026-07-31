const Avatar = ({ name = 'User', initials = 'U' }) => {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-300">
      {initials || name.charAt(0).toUpperCase()}
    </div>
  )
}

export default Avatar
