const TrackSearchResult = ({ track, chooseTrack }) => {
  const handlePlay = () => chooseTrack(track);
  return (
    <div
      className="d-flex m-2 aling-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img
        src={track.albumUrl}
        style={{ height: "64px", width: "64px" }}
        alt="song cover"
      />
      <div className="mx-3">
        <div style={{ color: "white" }}>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  );
};

export default TrackSearchResult;
