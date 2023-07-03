import Summary from "~summary"

export default function RenderSummary(summary_in: Summary) : JSX.Element {

    if (summary_in == null) {
        return <></>
    }

    return (
        <li className="message" id="summary">
            <p id="summaryTitle">{summary_in.title}</p>
            <p id="summaryChannel">{summary_in.channel}</p>
            <p id="summaryKeypoints">{summary_in.keypoints}</p>
        </li>
    )
}