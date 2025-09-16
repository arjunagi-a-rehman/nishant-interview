const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Dummy function to print cron expression
const processCronExpression = (cronExpression) => {
    console.log('='.repeat(50));
    console.log('📅 Cron Expression Received:');
    console.log(`   Expression: ${cronExpression}`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    console.log('='.repeat(50));
    
    // You can add more processing logic here
    return {
        message: 'Cron expression processed successfully',
        expression: cronExpression,
        processedAt: new Date().toISOString()
    };
};

// POST endpoint to accept cron job expressions
app.post('/api/cron', (req, res) => {
    try {
        const { cronExpression } = req.body;
        
        // Validate that cronExpression is provided
        if (!cronExpression) {
            return res.status(400).json({
                error: 'Missing cronExpression in request body',
                example: {
                    cronExpression: '0 0 * * *'
                }
            });
        }
        
        // Basic validation for cron expression format (5 or 6 parts)
        const cronParts = cronExpression.trim().split(/\s+/);
        if (cronParts.length < 5 || cronParts.length > 6) {
            return res.status(400).json({
                error: 'Invalid cron expression format. Expected 5-6 parts.',
                received: cronExpression,
                example: '0 0 * * * (minute hour day month weekday)'
            });
        }
        
        // Call dummy function to process the cron expression
        const result = processCronExpression(cronExpression);
        
        // Send success response
        res.status(200).json({
            success: true,
            ...result
        });
        
    } catch (error) {
        console.error('Error processing cron expression:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Cron Expression API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'Cron Expression API',
        endpoints: {
            'POST /api/cron': {
                description: 'Accept cron job expressions',
                body: {
                    cronExpression: 'string (required) - e.g., "0 0 * * *"'
                },
                example: {
                    cronExpression: '0 0 * * *'
                }
            },
            'GET /health': {
                description: 'Health check endpoint'
            }
        },
        examples: {
            'Every minute': '* * * * *',
            'Daily at midnight': '0 0 * * *',
            'Every hour': '0 * * * *',
            'Every Sunday at 2 AM': '0 2 * * 0',
            'Every weekday at 9 AM': '0 9 * * 1-5'
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('🚀 Cron Expression API Server Started');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`📋 API Documentation: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
    console.log(`📮 POST Endpoint: http://localhost:${PORT}/api/cron`);
    console.log('=' .repeat(60));
});
