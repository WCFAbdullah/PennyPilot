'use client'

import React from 'react'
import { Link } from "react-router-dom"
import { ArrowRight, LineChart, DollarSign, Notebook, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

function Footer() {
  return (
    <footer className="bg-gray-900/50 backdrop-blur border-t border-indigo-500/20 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-indigo-200">© {new Date().getFullYear()} PennyPilot. All rights reserved.</p>
      </div>
    </footer>
  )
}

function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 z-0">
      
      <main className="container mx-auto px-4 py-28 flex-grow relative">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-200 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Take Control of Your Finances
          </motion.h1>
          <motion.p 
            className="text-xl text-indigo-100 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Track, analyze, and optimize your spending with PennyPilot
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/dashboard"
              className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-500 transition duration-300 inline-flex items-center shadow-lg hover:shadow-indigo-500/30"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: LineChart, title: "Expense Tracking", description: "Categorize and visualize your spending habits" },
            { icon: DollarSign, title: "Budget Planning", description: "Set and manage budgets for the month" },
            { icon: Notebook, title: "Organization", description: "Organize all finances in one place" },
            { icon: Shield, title: "Secure & Private", description: "Your financial data is encrypted and never shared" },
          ].map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-900/50 backdrop-blur p-6 rounded-lg border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/10 transition duration-300 group"
              variants={itemVariants}
            >
              <feature.icon className="text-indigo-400 mb-4 group-hover:text-indigo-300 transition-colors duration-300" size={32} />
              <h3 className="text-xl font-semibold text-indigo-200 mb-2">{feature.title}</h3>
              <p className="text-indigo-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage