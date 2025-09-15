import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useRewards } from '../../hooks/useRewards';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { DepositModal } from '../common/DepositModal';
import { RewardsModal } from '../common/RewardsModal';
import { EmergencyReportModal } from '../common/EmergencyReportModal';
import { BSenseAI } from '../common/BSenseAI';
import { QRScanner } from '../common/QRScanner';
import { CreditProfileCard } from '../wallet/CreditProfileCard';
import { CreditCoachChat } from '../wallet/CreditCoachChat';
import { MedicalLoanOptions, LoanApplicationForm, LoanPaymentForm } from '../wallet/loans';
import { AddSavingsForm } from '../wallet/AddSavingsForm';
import { 
  Bike, 
  Wallet, 
  PiggyBank,
  CreditCard,
  Shield,
  Activity,
  Plus,
  Send,
  Eye,
  Award,
  Car,
  Stethoscope,
  Package,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  DollarSign,
  Route,
  Navigation,
  Fuel,
  AlertTriangle,
  XCircle,
  Target,
  Brain,
  QrCode,
  FileText
} from 'lucide-react';

interface RideRequest {
  id: string;
  patientName: string;
  pickup: string;
  destination: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedCost: number;
  distance: number;
  requestedBy: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'completed';
}

export const ParaBodaDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification, communityFunds } = useData();
  const { addReward, totalPoints } = useRewards();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [showCreditCoach, setShowCreditCoach] = useState(false);
  
  // Rider stats
  const [todayEarnings, setTodayEarnings] = useState(3200);
  const [totalRides, setTotalRides] = useState(8);
  const [rating, setRating] = useState(4.8);
  const [fuelCost, setFuelCost] = useState(800);
  
  // User points for rewards
  const userPoints = user?.points || 320;

  // Mock wallet data - riders get higher allocation due to income generation
  const walletData = {
    balance: Math.floor(communityFunds * 0.15),
    savings: Math.floor(communityFunds * 0.12),
    creditScore: Math.min(850, 350 + (userPoints * 1.5)),
    eligibilityStatus: user?.level === 'Gold' ? 'approved' : user?.level === 'Silver' ? 'approved' : 'pending',
    loanReadiness: Math.min(100, 60 + userPoints / 8),
    trustLevel: user?.level === 'Platinum' ? 'platinum' : user?.level === 'Gold' ? 'gold' : 'silver'
  };
  
  // Mock ride requests
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([
    {
      id: 'ride_001',
      patientName: 'Grace Wanjiku',
      pickup: 'Kiambu Village',
      destination: 'Kiambu District Hospital',
      urgency: 'high',
      estimatedCost: 800,
      distance: 8,
      requestedBy: 'CHV Sarah',
      timestamp: new Date(),
      status: 'pending'
    },
    {
      id: 'ride_002',
      patientName: 'Baby Michael',
      pickup: 'Nakuru Town',
      destination: 'Nakuru Health Center',
      urgency: 'medium',
      estimatedCost: 500,
      distance: 5,
      requestedBy: 'Mother Jane',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pending'
    }
  ]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const handleAcceptRide = (rideId: string) => {
    const ride = rideRequests.find(r => r.id === rideId);
    if (ride) {
      setRideRequests(prev => 
        prev.map(r => 
          r.id === rideId 
            ? { ...r, status: 'accepted' }
            : r
        )
      );
      
      addReward({
        type: 'ride_completed',
        points: 10 + ride.distance,
        meta: { distanceKm: ride.distance },
        description: `Completed ride for ${ride.patientName}`
      });
      
      addNotification({
        title: language === 'sw' ? 'Safari Imekubaliwa' : 'Ride Accepted',
        message: language === 'sw' ? 'Umeanza safari' : 'You have started the ride',
        type: 'success',
        read: false
      });
    }
  };

  const handleRejectRide = (rideId: string) => {
    setRideRequests(prev => prev.filter(ride => ride.id !== rideId));
    
    addNotification({
      title: language === 'sw' ? 'Safari Imekataliwa' : 'Ride Rejected',
      message: language === 'sw' ? 'Safari imekataliwa' : 'Ride has been rejected',
      type: 'info',
      read: false
    });
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedLoanType('');
    setShowCreditCoach(false);
  };

  const handleModalSuccess = () => {
    handleModalClose();
  };

  const handleLoanApplication = (loanType: string) => {
    setSelectedLoanType(loanType);
    setActiveModal('loanApplication');
  };

  return (
    <div className="min-h-screen dashboard-bg-rider">
      <Header 
        title={language === 'sw' ? 'ParaBoda' : 'ParaBoda Rider'}
        subtitle={language === 'sw' ? 'Msafiri wa afya' : 'Health transport rider'}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome & Performance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">🏍️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
                </h1>
                <p className="text-gray-600">{language === 'sw' ? 'Msafiri wa Afya' : 'Health Transport Rider'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{formatAmount(todayEarnings)}</div>
              <div className="text-sm text-gray-500">{language === 'sw' ? 'Mapato ya leo' : 'Today\'s earnings'}</div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title={language === 'sw' ? 'Safari za Leo' : 'Today\'s Rides'}
              value={totalRides.toString()}
              icon={Route}
              color="orange"
            />
            <StatsCard
              title={language === 'sw' ? 'Kiwango' : 'Rating'}
              value={`${rating}/5`}
              icon={Star}
              color="yellow"
            />
            <StatsCard
              title={language === 'sw' ? 'Mapato Safi' : 'Net Earnings'}
              value={formatAmount(todayEarnings)}
              icon={DollarSign}
              color="green"
              isCurrency={true}
              currencyAmount={todayEarnings}
            />
            <StatsCard
              title={language === 'sw' ? 'Gharama za Mafuta' : 'Fuel Costs'}
              value={formatAmount(fuelCost)}
              icon={Fuel}
              color="red"
              isCurrency={true}
              currencyAmount={fuelCost}
            />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ride Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Rides */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>{language === 'sw' ? 'Safari za Dharura' : 'Emergency Rides'}</span>
              </h2>
              
              {rideRequests.filter(r => r.urgency === 'high').length > 0 ? (
                <div className="space-y-4">
                  {rideRequests.filter(r => r.urgency === 'high').map((request) => (
                    <div key={request.id} className="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{request.patientName}</h3>
                          <p className="text-sm text-gray-600">{language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}</p>
                        </div>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                          {language === 'sw' ? 'DHARURA' : 'URGENT'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{request.pickup} → {request.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="font-bold text-green-600">{formatAmount(request.estimatedCost)} • {request.distance}km</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAcceptRide(request.id)}
                          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{language === 'sw' ? 'KUBALI' : 'ACCEPT'}</span>
                        </button>
                        <button
                          onClick={() => handleRejectRide(request.id)}
                          className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{language === 'sw' ? 'KATAA' : 'REJECT'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-green-50 rounded-xl">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-green-700 font-medium">
                    {language === 'sw' ? 'Hakuna safari za dharura' : 'No emergency rides'}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Regular Ride Requests */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Route className="w-5 h-5 text-blue-600" />
                <span>{language === 'sw' ? 'Safari za Kawaida' : 'Regular Rides'}</span>
              </h2>

              <div className="space-y-4">
                {rideRequests.filter(r => r.urgency !== 'high').map((request) => (
                  <div key={request.id} className={`p-4 rounded-xl border-2 ${getUrgencyColor(request.urgency)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{request.patientName}</h3>
                        <p className="text-sm text-gray-600">{language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency === 'medium' ? (language === 'sw' ? 'WASTANI' : 'MEDIUM') : (language === 'sw' ? 'CHINI' : 'LOW')}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{request.pickup} → {request.destination}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-green-600">{formatAmount(request.estimatedCost)} • {request.distance}km</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAcceptRide(request.id)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{language === 'sw' ? 'KUBALI' : 'ACCEPT'}</span>
                      </button>
                      <button
                        onClick={() => handleRejectRide(request.id)}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{language === 'sw' ? 'KATAA' : 'REJECT'}</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {rideRequests.filter(r => r.urgency !== 'high').length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <div className="text-4xl mb-2">🏍️</div>
                    <p className="text-gray-500 font-medium">
                      {language === 'sw' ? 'Hakuna maombi ya safari' : 'No ride requests'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Earnings Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>{language === 'sw' ? 'Mgawanyo wa Mapato' : 'Earnings Breakdown'}</span>
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">{language === 'sw' ? 'Mapato ya jumla' : 'Gross earnings'}:</span>
                  <span className="font-bold text-green-600">{formatAmount(todayEarnings + fuelCost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700">{language === 'sw' ? 'Gharama za mafuta' : 'Fuel costs'}:</span>
                  <span className="font-bold text-red-600">-{formatAmount(fuelCost)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-900 font-bold">{language === 'sw' ? 'Mapato safi' : 'Net earnings'}:</span>
                    <span className="font-bold text-blue-600 text-xl">{formatAmount(todayEarnings)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Wallet & Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* M-SUPU Wallet */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <PiggyBank className="w-5 h-5 text-green-600" />
                <span>{language === 'sw' ? 'M-SUPU Pochi' : 'M-SUPU Wallet'}</span>
              </h2>

              <CreditProfileCard
                creditScore={walletData.creditScore}
                savingsBalance={walletData.savings}
                eligibilityStatus={walletData.eligibilityStatus as any}
                loanReadiness={walletData.loanReadiness}
                trustLevel={walletData.trustLevel as any}
              />
            </motion.div>

            {/* Wallet Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'sw' ? 'Vitendo vya Pochi' : 'Wallet Actions'}
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setActiveModal('medicalLoanOptions')}
                  className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-left min-h-[60px]"
                >
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-bold text-blue-900">{language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}</div>
                      <div className="text-sm text-blue-700">{language === 'sw' ? 'Vifaa vya pikipiki' : 'Motorcycle equipment'}</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal('addSavings')}
                  className="w-full p-3 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors text-left min-h-[60px]"
                >
                  <div className="flex items-center space-x-3">
                    <PiggyBank className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-bold text-green-900">{language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}</div>
                      <div className="text-sm text-green-700">{language === 'sw' ? 'Akiba za kibinafsi' : 'Personal savings'}</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal('loanPayment')}
                  className="w-full p-3 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors text-left min-h-[60px]"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    <div>
                      <div className="font-bold text-purple-900">{language === 'sw' ? 'Lipa Mkopo' : 'Loan Payment'}</div>
                      <div className="text-sm text-purple-700">{language === 'sw' ? 'Malipo ya mkopo' : 'Repay loan'}</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowCreditCoach(true)}
                  className="w-full p-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors text-left min-h-[60px]"
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-indigo-600" />
                    <div>
                      <div className="font-bold text-indigo-900">{language === 'sw' ? 'Mkocha' : 'Coach'}</div>
                      <div className="text-sm text-indigo-700">{language === 'sw' ? 'Ushauri wa kifedha' : 'Financial advice'}</div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Rider Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'sw' ? 'Vifaa vya Msafiri' : 'Rider Tools'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveModal('map')}
                  className="p-3 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors text-center min-h-[70px]"
                >
                  <Navigation className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <span className="text-sm font-bold text-green-900">{language === 'sw' ? 'Ramani' : 'Map'}</span>
                </button>

                <button
                  onClick={() => setActiveModal('emergencyReport')}
                  className="p-3 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors text-center min-h-[70px]"
                >
                  <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <span className="text-sm font-bold text-red-900">{language === 'sw' ? 'Ripoti' : 'Report'}</span>
                </button>

                <button
                  onClick={() => setActiveModal('bsenseAI')}
                  className="p-3 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors text-center min-h-[70px]"
                >
                  <Brain className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <span className="text-sm font-bold text-purple-900">{language === 'sw' ? 'AI' : 'AI'}</span>
                </button>

                <button
                  onClick={() => setActiveModal('qrScanner')}
                  className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-center min-h-[70px]"
                >
                  <QrCode className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <span className="text-sm font-bold text-blue-900">{language === 'sw' ? 'Skani' : 'Scan'}</span>
                </button>
              </div>
            </motion.div>

            {/* Community Rewards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span>{language === 'sw' ? 'Zawadi za Jamii' : 'Community Rewards'}</span>
              </h3>
              
              <div className="space-y-3">
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{userPoints}</div>
                  <p className="text-yellow-800 text-sm font-medium">{language === 'sw' ? 'Pointi Zako' : 'Your Points'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{totalRides}</div>
                    <p className="text-green-800 text-xs font-medium">{language === 'sw' ? 'Safari' : 'Rides'}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{rating}/5</div>
                    <p className="text-blue-800 text-xs font-medium">{language === 'sw' ? 'Kiwango' : 'Rating'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {activeModal === 'map' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-center mb-4">
              {language === 'sw' ? 'Ramani ya GPS' : 'GPS Map'}
            </h2>
            
            <div className="bg-blue-50 p-6 rounded-xl text-center mb-4">
              <Navigation className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 font-medium">
                {language === 'sw' ? 'Mahali pako pa sasa' : 'Your current location'}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                📍 {language === 'sw' ? 'GPS inaendelea' : 'GPS tracking active'}
              </p>
            </div>
            
            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              {language === 'sw' ? 'Sawa' : 'OK'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Other Modals */}
      <EmergencyReportModal
        isOpen={activeModal === 'emergencyReport'}
        onClose={() => setActiveModal(null)}
        onSubmit={(reportData) => {
          addNotification({
            title: language === 'sw' ? 'Ripoti ya Dharura Imewasilishwa' : 'Emergency Report Submitted',
            message: language === 'sw' ? 'Ripoti yako imewasilishwa kwa msimamizi' : 'Your report has been submitted to admin',
            type: 'warning',
            read: false
          });
          setActiveModal(null);
        }}
        emergencyType="medical"
      />

      <BSenseAI
        isOpen={activeModal === 'bsenseAI'}
        onClose={() => setActiveModal(null)}
        userRole="rider"
      />

      <QRScanner
        isOpen={activeModal === 'qrScanner'}
        onClose={() => setActiveModal(null)}
        onScan={(data) => {
          console.log('QR Scanned:', data);
          setActiveModal(null);
          addNotification({
            title: language === 'sw' ? 'QR Code Imesomwa' : 'QR Code Scanned',
            message: language === 'sw' ? 'Taarifa zimepatikana' : 'Information retrieved',
            type: 'success',
            read: false
          });
        }}
      />

      <ServiceRequestModal
        isOpen={activeModal === 'serviceRequest'}
        onClose={() => setActiveModal(null)}
        onRequest={(serviceData) => {
          addNotification({
            title: language === 'sw' ? 'Ombi la Huduma Limewasilishwa' : 'Service Request Submitted',
            message: language === 'sw' ? 'Ombi lako limewasilishwa' : 'Your request has been submitted',
            type: 'success',
            read: false
          });
          setActiveModal(null);
        }}
      />

      {/* Wallet Modals */}
      <MedicalLoanOptions
        isOpen={activeModal === 'medicalLoanOptions'}
        onClose={handleModalClose}
        onLoanSelect={handleLoanApplication}
      />

      <LoanApplicationForm
        isOpen={activeModal === 'loanApplication'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        loanType={selectedLoanType}
      />

      <AddSavingsForm
        isOpen={activeModal === 'addSavings'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        currentBalance={walletData.balance}
      />

      <LoanPaymentForm
        isOpen={activeModal === 'loanPayment'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <CreditCoachChat
        isOpen={showCreditCoach}
        onClose={() => setShowCreditCoach(false)}
        userCreditScore={walletData.creditScore}
        userSavings={walletData.savings}
      />
    </div>
  );
};