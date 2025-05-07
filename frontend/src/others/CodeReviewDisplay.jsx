import React from 'react'

const CodeReviewDisplay = ({ reviewData }) => {
    if (!reviewData?.success) return <div className="text-red-500">Error loading review</div>;
  
    // Parse the raw data into structured format
    const parseReview = (rawText) => {
      const codeMatch = rawText.match(/```javascript\n([\s\S]*?)\n```/);
      const qualityMatch = rawText.match(/Code Quality \((\d+\/\d+)\)/);
      const performanceMatch = rawText.match(/Performance Suggestions([\s\S]*?)(?=\n\*\*3\.)/);
      const issuesMatch = rawText.match(/Potential Issues([\s\S]*?)(?=\n\*\*4\.)/);
      const bestPracticesMatch = rawText.match(/Best Practices Recommendations([\s\S]*?)(?=\n\*\*5\.)/);
      const documentationMatch = rawText.match(/Documentation Suggestions([\s\S]*?)(?=\n\*\*Summary)/);
      const codeExamples = [...rawText.matchAll(/```javascript\n([\s\S]*?)\n```/g)];
  
      return {
        codeSnippet: codeMatch?.[1] || '',
        qualityScore: qualityMatch?.[1] || '',
        qualityNotes: extractBulletPoints(rawText, /Code Quality[\s\S]*?\n\*([\s\S]*?)(?=\n\*\*2\.)/),
        performance: extractBulletPoints(rawText, /Performance Suggestions[\s\S]*?\n\*([\s\S]*?)(?=\n\*\*3\.)/),
        issues: extractBulletPoints(rawText, /Potential Issues[\s\S]*?\n\*([\s\S]*?)(?=\n\*\*4\.)/),
        bestPractices: extractBulletPoints(rawText, /Best Practices Recommendations[\s\S]*?\n\*([\s\S]*?)(?=\n\*\*5\.)/),
        documentation: documentationMatch?.[1]?.trim() || '',
        codeExamples: codeExamples.map(match => match[1]),
        summary: rawText.split('**Summary:**')[1]?.trim() || ''
      };
    };
  
    const extractBulletPoints = (text, regex) => {
      const match = text.match(regex);
      if (!match) return [];
      return match[1].split('\n*')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    };
  
    const review = parseReview(reviewData.data);
  
    return (
      <div className="code-review-container bg-gray-900 text-gray-100 p-6 rounded-lg max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Code Review</h2>
        </div>
  
        {/* Code Snippet */}
        {review.codeSnippet && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">REVIEWED CODE</h3>
            <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
              <code>{review.codeSnippet}</code>
            </pre>
          </div>
        )}
  
        {/* Quality Rating */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-yellow-400">★</span> Code Quality
            </h3>
            <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-mono">
              {review.qualityScore}
            </span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            {review.qualityNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
  
        {/* Performance */}
        {review.performance.length > 0 && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-green-400">⚡</span> Performance
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {review.performance.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Issues */}
        {review.issues.length > 0 && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-red-400">⚠️</span> Potential Issues
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {review.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Best Practices */}
        {review.bestPractices.length > 0 && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-blue-400">🛠️</span> Best Practices
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {review.bestPractices.map((practice, i) => (
                <li key={i}>{practice}</li>
              ))}
            </ul>
            {review.codeExamples.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">EXAMPLE IMPLEMENTATIONS</h4>
                {review.codeExamples.map((example, i) => (
                  <pre key={i} className="bg-gray-900 p-3 rounded-md overflow-x-auto text-sm mb-3">
                    <code>{example}</code>
                  </pre>
                ))}
              </div>
            )}
          </div>
        )}
  
        {/* Documentation */}
        {review.documentation && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-purple-400">📝</span> Documentation
            </h3>
            <p className="text-gray-300 whitespace-pre-line">{review.documentation}</p>
          </div>
        )}
  
        {/* Summary */}
        {review.summary && (
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800/50">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Summary</h3>
            <p className="text-gray-300">{review.summary}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default CodeReviewDisplay;
  // Usage example:
  // <CodeReviewDisplay reviewData={yourApiResponse} />