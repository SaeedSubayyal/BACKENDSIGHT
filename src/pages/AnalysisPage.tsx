import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BarChart3, Bot, Sparkles, TrendingUp, Plus, X } from 'lucide-react'
import { useAnalyzeBrand, useOptimizationMetrics, useAnalyzeQueries } from '../hooks/useApi'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { cn } from '../lib/utils'

const analysisSchema = z.object({
  brand_name: z.string().min(2, 'Brand name must be at least 2 characters').max(100),
  website_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  product_categories: z.array(z.string()).min(1, 'At least one category is required').max(10),
  content_sample: z.string().max(50000, 'Content sample too large').optional(),
  competitor_names: z.array(z.string()).max(5, 'Maximum 5 competitors allowed').optional(),
})

type AnalysisForm = z.infer<typeof analysisSchema>

export const AnalysisPage: React.FC = () => {
  const [analysisType, setAnalysisType] = React.useState<'full' | 'metrics' | 'queries'>('full')
  const [categories, setCategories] = React.useState<string[]>([''])
  const [competitors, setCompetitors] = React.useState<string[]>([''])
  const [results, setResults] = React.useState<any>(null)

  const analyzeBrandMutation = useAnalyzeBrand()
  const optimizationMetricsMutation = useOptimizationMetrics()
  const analyzeQueriesMutation = useAnalyzeQueries()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AnalysisForm>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      product_categories: [''],
      competitor_names: [''],
    },
  })

  const watchedCategories = watch('product_categories')
  const watchedCompetitors = watch('competitor_names')

  React.useEffect(() => {
    setValue('product_categories', categories.filter(c => c.trim()))
  }, [categories, setValue])

  React.useEffect(() => {
    setValue('competitor_names', competitors.filter(c => c.trim()))
  }, [competitors, setValue])

  const addCategory = () => {
    if (categories.length < 10) {
      setCategories([...categories, ''])
    }
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...categories]
    newCategories[index] = value
    setCategories(newCategories)
  }

  const addCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([...competitors, ''])
    }
  }

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index))
  }

  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...competitors]
    newCompetitors[index] = value
    setCompetitors(newCompetitors)
  }

  const onSubmit = async (data: AnalysisForm) => {
    try {
      let result
      
      switch (analysisType) {
        case 'full':
          result = await analyzeBrandMutation.mutateAsync(data)
          break
        case 'metrics':
          result = await optimizationMetricsMutation.mutateAsync({
            brand_name: data.brand_name,
            content_sample: data.content_sample,
            website_url: data.website_url,
          })
          break
        case 'queries':
          result = await analyzeQueriesMutation.mutateAsync({
            brand_name: data.brand_name,
            product_categories: data.product_categories,
          })
          break
      }
      
      setResults(result)
    } catch (error) {
      // Error handling is done in the mutations
    }
  }

  const isLoading = analyzeBrandMutation.isPending || 
                   optimizationMetricsMutation.isPending || 
                   analyzeQueriesMutation.isPending

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Brand Analysis</h1>
        <p className="text-secondary-600 mt-1">
          Analyze your brand's AI optimization performance across multiple platforms
        </p>
      </div>

      {/* Analysis type selector */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Analysis Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setAnalysisType('full')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
              analysisType === 'full'
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-secondary-300'
            )}
          >
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <h4 className="font-semibold text-secondary-900">Full Analysis</h4>
            </div>
            <p className="text-sm text-secondary-600">
              Complete 12-metric analysis with recommendations and implementation roadmap
            </p>
            <div className="mt-2 text-xs text-secondary-500">
              ~45-90 seconds
            </div>
          </button>

          <button
            onClick={() => setAnalysisType('metrics')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
              analysisType === 'metrics'
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-secondary-300'
            )}
          >
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-success-600" />
              <h4 className="font-semibold text-secondary-900">Metrics Only</h4>
            </div>
            <p className="text-sm text-secondary-600">
              Calculate optimization metrics without full analysis
            </p>
            <div className="mt-2 text-xs text-secondary-500">
              ~15-30 seconds
            </div>
          </button>

          <button
            onClick={() => setAnalysisType('queries')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
              analysisType === 'queries'
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-secondary-300'
            )}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="w-6 h-6 text-warning-600" />
              <h4 className="font-semibold text-secondary-900">Query Analysis</h4>
            </div>
            <p className="text-sm text-secondary-600">
              Generate and analyze semantic queries for your brand
            </p>
            <div className="mt-2 text-xs text-secondary-500">
              ~5-15 seconds
            </div>
          </button>
        </div>
      </div>

      {/* Analysis form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Brand Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Brand Name *
              </label>
              <input
                {...register('brand_name')}
                type="text"
                className="input"
                placeholder="Enter your brand name"
              />
              {errors.brand_name && (
                <p className="mt-1 text-sm text-error-600">{errors.brand_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Website URL
              </label>
              <input
                {...register('website_url')}
                type="url"
                className="input"
                placeholder="https://your-website.com"
              />
              {errors.website_url && (
                <p className="mt-1 text-sm text-error-600">{errors.website_url.message}</p>
              )}
            </div>
          </div>

          {/* Product categories */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Product Categories * (1-10 categories)
            </label>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="input flex-1"
                    placeholder={`Category ${index + 1}`}
                  />
                  {categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="p-2 text-error-500 hover:text-error-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {categories.length < 10 && (
                <button
                  type="button"
                  onClick={addCategory}
                  className="btn-outline btn-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Category
                </button>
              )}
            </div>
            {errors.product_categories && (
              <p className="mt-1 text-sm text-error-600">{errors.product_categories.message}</p>
            )}
          </div>

          {/* Content sample */}
          {analysisType !== 'queries' && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Content Sample
              </label>
              <textarea
                {...register('content_sample')}
                rows={6}
                className="input resize-none"
                placeholder="Paste a sample of your content here (product descriptions, about page, etc.)"
              />
              {errors.content_sample && (
                <p className="mt-1 text-sm text-error-600">{errors.content_sample.message}</p>
              )}
              <p className="mt-1 text-xs text-secondary-500">
                Optional: Provide content to improve analysis accuracy
              </p>
            </div>
          )}

          {/* Competitors */}
          {analysisType === 'full' && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Competitor Names (Optional, max 5)
              </label>
              <div className="space-y-2">
                {competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={competitor}
                      onChange={(e) => updateCompetitor(index, e.target.value)}
                      className="input flex-1"
                      placeholder={`Competitor ${index + 1}`}
                    />
                    {competitors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompetitor(index)}
                        className="p-2 text-error-500 hover:text-error-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {competitors.length < 5 && (
                  <button
                    type="button"
                    onClick={addCompetitor}
                    className="btn-outline btn-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Competitor
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary px-8"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {analysisType === 'full' ? 'Running Analysis...' : 
                 analysisType === 'metrics' ? 'Calculating Metrics...' : 
                 'Analyzing Queries...'}
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                {analysisType === 'full' ? 'Run Full Analysis' : 
                 analysisType === 'metrics' ? 'Calculate Metrics' : 
                 'Analyze Queries'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      {results && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Analysis Results</h3>
          <div className="bg-secondary-50 rounded-lg p-4">
            <pre className="text-sm text-secondary-700 whitespace-pre-wrap overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}