module.exports = {
    apps: [
        {
            name: 'dev-metrics-app',
            script: 'npm',
            args: 'run start:prod',
            autorestart: true,
            watch: false,
            max_memory_restart: '300M',
        },
    ],
};
