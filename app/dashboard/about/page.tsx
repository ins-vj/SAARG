'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, Leaf, Target, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-8 h-8" />
          About FarmReport
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Learn about our seed health analysis platform
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              FarmReport is dedicated to helping farmers optimize their crop yields by providing
              advanced seed health analysis using cutting-edge machine learning technology. We
              believe that accurate, real-time data about seed quality is crucial for successful
              agriculture.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">1. Hardware Integration</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Connect your seed analysis hardware device to the system
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">2. Seed Placement</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Place your seed in the hardware device for analysis
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">3. ML Analysis</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Our machine learning model processes the seed image and data
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">4. PDF Report</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Receive a comprehensive PDF report with recommendations
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Real-time Analysis</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get instant results without delays
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Detailed Metrics</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Health score, germination rate, moisture level, and more
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">PDF Reports</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download and share professional reports
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Smart Recommendations</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Actionable insights for better farming decisions
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your data security is our top priority. We use:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                End-to-end encryption for all data transmission
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Secure authentication with Supabase
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Row-level security policies for data access
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Regular security audits and updates
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Version & Support</CardTitle>
            <CardDescription>Information about this application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Application Version:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Built with:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  Next.js, TypeScript, Supabase
                </span>
              </div>
              <div className="pt-4">
                <p className="text-gray-600 dark:text-gray-400">
                  For support or questions, please contact our team at support@farmreport.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
