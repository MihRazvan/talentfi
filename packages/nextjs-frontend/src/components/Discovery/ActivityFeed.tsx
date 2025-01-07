import React from 'react';
import { Clock } from 'lucide-react';
import { mockActivityFeed } from '../../data/mockData';

const ActivityFeed = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-medium mb-4 text-slate-900">Recent activity</h2>
            <div className="space-y-4">
                {mockActivityFeed.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <img
                            src={`https://avatars.githubusercontent.com/${activity.username}`}
                            alt={activity.username}
                            className="w-8 h-8 rounded-full border border-slate-100"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://github.com/identicons/icon.png';
                            }}
                        />
                        <div className="flex-1">
                            <p className="text-sm">
                                <span className="text-slate-900">Support: @{activity.username}</span>
                                <br />
                                <span className="text-slate-500">
                                    Anon bought ${activity.amount} at {activity.price}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center text-sm text-slate-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.time} ago
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;