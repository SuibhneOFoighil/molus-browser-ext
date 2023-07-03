import Summary from "~summary"

function parseBulletPoints(bulletPoints: string): string[] {
    const bulletList = bulletPoints.split(/\n|\r/);
    const result = [];
  
    for (let i = 0; i < bulletList.length; i++) {
      const bullet = bulletList[i].trim();
      if (bullet.startsWith("-")) {
        result.push(bullet.substring(1).trim());
      }
    }
  
    return result;
}

export default function RenderSummary(summary_in: Summary) : JSX.Element {

    if (summary_in == null) {
        return <></>
    }

    const bullets = parseBulletPoints(summary_in.keypoints);

    return (
        <li className="message" id="summary">
            <p id="summaryTitle">{summary_in.title}</p>
            <p id="summaryChannel">{summary_in.channel}</p>
            {/* <p id="summaryKeypointsHeader">Key Points:</p> */}
            <ul id="summaryKeypoints">
                {
                    bullets.map((bullet, index) => <li key={index} className="keypoint">
                        <span className="keypointBullet">ᐅᐅ </span>{bullet}
                    </li>)
                }
            </ul>
        </li>
    )
}