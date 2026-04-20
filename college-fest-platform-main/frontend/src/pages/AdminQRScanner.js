import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Users, 
  Shield,
  Clock,
  MapPin
} from 'lucide-react';

const AdminQRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const { user, api } = useAuth();

  useEffect(() => {
    // Load scan history from localStorage
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    setScanHistory(history);
  }, []);

  const handleQRScan = (qrData) => {
    try {
      const parsedData = JSON.parse(qrData);
      setScannedData(parsedData);
      setIsScanning(false);

      // Add to scan history
      const newScan = {
        id: Date.now(),
        userData: parsedData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      const updatedHistory = [newScan, ...scanHistory];
      setScanHistory(updatedHistory);
      localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));

      // Auto-approve after 2 seconds (for demo)
      setTimeout(() => {
        approveEntry(newScan.id);
      }, 2000);

    } catch (error) {
      console.error('Error parsing QR data:', error);
      setScannedData({ error: 'Invalid QR code format' });
    }
  };

  const approveEntry = async (scanId) => {
    try {
      // In real app, this would call backend API
      // For demo, we'll update local state
      setScanHistory(prev => 
        prev.map(scan => 
          scan.id === scanId 
            ? { ...scan, status: 'approved', approvedAt: new Date().toISOString() }
            : scan
        )
      );

      // Show success notification
      alert('Entry approved successfully!');
      
    } catch (error) {
      console.error('Error approving entry:', error);
      alert('Failed to approve entry');
    }
  };

  const rejectEntry = async (scanId) => {
    try {
      setScanHistory(prev => 
        prev.map(scan => 
          scan.id === scanId 
            ? { ...scan, status: 'rejected', rejectedAt: new Date().toISOString() }
            : scan
        )
      );

      // Show rejection notification
      alert('Entry rejected');
      
    } catch (error) {
      console.error('Error rejecting entry:', error);
      alert('Failed to reject entry');
    }
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('scanHistory');
  };

  const simulateQRScan = () => {
    // Simulate QR scan for testing
    const mockQRData = JSON.stringify({
      userId: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      paymentId: 'pay_123456',
      paymentStatus: 'paid',
      timestamp: new Date().toISOString()
    });
    
    handleQRScan(mockQRData);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          className="glass rounded-2xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            Admin access required to use QR scanner.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow"
            >
              Go to Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">🎫 QR Entry Scanner</h1>
          <p className="text-xl text-gray-400">Scan participant QR codes for festival entry</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <QrCode className="w-6 h-6 mr-2" />
                Scan QR Code
              </h3>
              
              {/* QR Scanner Simulation */}
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Position QR code within frame</p>
                  <button
                    onClick={simulateQRScan}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    📷 Simulate Scan
                  </button>
                </div>

                {scannedData && (
                  <motion.div
                    className="p-4 bg-white/5 rounded-lg border border-green-500/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h4 className="text-lg font-semibold text-white">QR Code Scanned Successfully!</h4>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white font-medium">{scannedData.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white font-medium">{scannedData.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Status:</span>
                        <span className={`font-medium ${
                          scannedData.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {scannedData.paymentStatus === 'paid' ? '✓ Paid' : '✗ Unpaid'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment ID:</span>
                        <span className="text-neon-blue font-mono">{scannedData.paymentId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Scan Time:</span>
                        <span className="text-white">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={() => approveEntry(scanHistory.find(s => s.userData === scannedData)?.id)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Entry
                      </button>
                      <button
                        onClick={() => rejectEntry(scanHistory.find(s => s.userData === scannedData)?.id)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Entry
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Scan History */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                Recent Scans
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scanHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No scans yet today</p>
                  </div>
                ) : (
                  scanHistory.map((scan) => (
                    <motion.div
                      key={scan.id}
                      className="p-4 bg-white/5 rounded-lg border border-gray-600/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            scan.status === 'approved' ? 'bg-green-400' :
                            scan.status === 'rejected' ? 'bg-red-400' :
                            'bg-yellow-400'
                          }`} />
                          <span className="text-white text-sm font-medium">
                            {scan.status === 'approved' ? 'Approved' :
                             scan.status === 'rejected' ? 'Rejected' : 'Pending'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(scan.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{scan.userData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white">{scan.userData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment:</span>
                          <span className={`${
                            scan.userData.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {scan.userData.paymentStatus === 'paid' ? '✓ Paid' : '✗ Unpaid'}
                          </span>
                        </div>
                      </div>
                      
                      {scan.status === 'approved' && (
                        <div className="mt-2 p-2 bg-green-500/20 rounded text-xs text-green-400">
                          ✓ Approved at {new Date(scan.approvedAt).toLocaleTimeString()}
                        </div>
                      )}
                      
                      {scan.status === 'rejected' && (
                        <div className="mt-2 p-2 bg-red-500/20 rounded text-xs text-red-400">
                          ✗ Rejected at {new Date(scan.rejectedAt).toLocaleTimeString()}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {scanHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="w-full mt-4 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  Clear History
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Footer */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Total Scans</h4>
            <p className="text-2xl font-bold text-neon-blue">{scanHistory.length}</p>
          </div>
          
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Approved</h4>
            <p className="text-2xl font-bold text-green-400">
              {scanHistory.filter(s => s.status === 'approved').length}
            </p>
          </div>
          
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Rejected</h4>
            <p className="text-2xl font-bold text-red-400">
              {scanHistory.filter(s => s.status === 'rejected').length}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminQRScanner;
