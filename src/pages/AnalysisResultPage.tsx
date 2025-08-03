import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb
} from 'lucide-react'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatPercentage, getGradeColor, getMetricDescription, cn } from '../lib/utils'

// Mock data - replace with actual API call
const mockAnalysisResult = {
  brand_name: 'TestTech Solutions',
  analysis_date: '2024-01-15T10:30:00Z',
  optimization_metrics: {
    chunk_retrieval_frequency: 0.75,
    embedding_relevance_score: 0.82,
    attribution_rate: 0.68,
    ai_citation_count: 23,
    vector_index_presence_rate: 0.91,
    retrieval_confidence_score: 0.77,
    rrf_rank_contribution: 0.71,
    llm_answer_coverage: 0.84,
    ai_model_crawl_success_rate: 0.93,
    semantic_density_score: 0.79,
    zero_click_surface_presence: 0.65,
    machine_validated_authority: 0.73,
    overall_score: 0.78,
    performance_grade: 'B+'
  },
  performance_summary: {
    strengths: [
      'High AI model crawl success rate (93%)',
      'Strong vector index presence (91%)',
      'Good LLM answer coverage (84%)'
    ],
    weaknesses: [
      'Low zero-click surface presence (65%)',
      'Attribution rate below target (68%)',
      'Semantic density could be improved (79%)'
    ]
  },
  priority_recommendations: [
    {
      priority: 'high',
      category: 'Content Optimization',
      title: 'Improve Zero-Click Presence',
      description: 'Your content appears in only 65% of direct AI answers',
      action_items: [
        'Create FAQ sections with direct answers',
        'Structure content for featured snippets',
        'Add schema markup for better understanding'
      ],
      impact: 'High',
      effort: 'Medium',
      timeline: '2-4 weeks'
    },
    {
      priority: 'medium',
      category: 'Brand Visibility',
      title: 'Increase Attribution Rate',
      description: 'AI systems mention your brand in 68% of relevant responses',
      action_items: [
        'Include brand name in key content sections',
        'Create authoritative content pieces',
        'Optimize meta descriptions and titles'
      ],
      impact: 'Medium',
      effort: 'Low',
      timeline: '1-2 weeks'
    }
  ]
}

export const AnalysisResultPage: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>()
  const [isLoading, setIsLoading] = React.useState(false)

  // In a real app, you'd fetch the analysis result here
  const result = mockAnalysisResult

  const metrics = result.optimization_metrics
  const metricEntries = Object.entries(metrics).filter(([key]) => 
    key !== 'overall_score' && key !== 'performance_grade'
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error-700 bg-error-50 border-error-200'
      case 'medium':
        return 'text-warning-700 bg-warning-50 border-warning-200'
      case 'low':
        return 'text-success-700 bg-success-50 border-success-200'
      default:
        return 'text-secondary-700 bg-secondary-50 border-secondary-200'
    }
  }

  const downloadReport = () => {
    // Implement PDF/CSV download
    console.log('Downloading report...')
  }

  const shareResults = () => {
    // Implement sharing functionality
    console.log('Sharing results...')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/brands" className="p-2 text-secondary-400 hover:text-secondary-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Analysis Results</h1>
            <p className="text-secondary-600 mt-1">
              {result.brand_name} • {new Date(result.analysis_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={shareResults} className="btn-outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          <button onClick={downloadReport} className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>

      {/* Overall score */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Overall Performance</h2>
            <p className="text-secondary-600 mt-1">
              AI optimization score across all metrics
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-secondary-900">
              {Math.round((metrics.overall_score || 0) * 100)}%
            </div>
            <div className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2',
              getGradeColor(metrics.performance_grade || 'F')
            )}>
              Grade: {metrics.performance_grade}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="w-full bg-secondary-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(metrics.overall_score || 0) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strengths and weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <h3 className="text-lg font-semibold text-secondary-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {result.performance_summary.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-success-500 rounded-full mt-2" />
                <span className="text-sm text-secondary-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning-600" />
            <h3 className="text-lg font-semibold text-secondary-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {result.performance_summary.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-warning-500 rounded-full mt-2" />
                <span className="text-sm text-secondary-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Detailed Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricEntries.map(([key, value]) => {
            const numericValue = typeof value === 'number' ? value : 0
            const displayValue = key === 'ai_citation_count' 
              ? value.toString() 
              : formatPercentage(numericValue * 100)
            
            return (
              <div key={key} className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-secondary-900 capitalize">
                    {key.replace(/_/g, ' ')}
                  </h4>
                  <span className="text-lg font-bold text-secondary-900">
                    {displayValue}
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ 
                      width: `${key === 'ai_citation_count' 
                        ? Math.min(100, (numericValue / 40) * 100) 
                        : numericValue * 100}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-secondary-600">
                  {getMetricDescription(key)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Lightbulb className="w-5 h-5 text-warning-600" />
          <h3 className="text-lg font-semibold text-secondary-900">Priority Recommendations</h3>
        </div>
        
        <div className="space-y-6">
          {result.priority_recommendations.map((rec, index) => (
            <div key={index} className="border border-secondary-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getPriorityColor(rec.priority)
                    )}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-sm text-secondary-500">{rec.category}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-secondary-900">{rec.title}</h4>
                  <p className="text-secondary-600 mt-1">{rec.description}</p>
                </div>
                <div className="text-right text-sm text-secondary-500">
                  <div>Impact: <span className="font-medium">{rec.impact}</span></div>
                  <div>Effort: <span className="font-medium">{rec.effort}</span></div>
                  <div>Timeline: <span className="font-medium">{rec.timeline}</span></div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-secondary-900 mb-2">Action Items:</h5>
                <ul className="space-y-1">
                  {rec.action_items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-secondary-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}