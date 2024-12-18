import React, { useEffect, useState } from 'react';
import './Notifications.css'; // Import the CSS file
import Navbar from './Navbar';
import logAction  from '../utils/logAction'; // Import logAction

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in local storage
    const [readNotifications, setReadNotifications] = useState([]);

    // Fetch the list of read notification IDs from localStorage
    useEffect(() => {
        const storedReadNotifications = JSON.parse(localStorage.getItem('readNotifications')) || [];
        setReadNotifications(storedReadNotifications);
    }, []);

    useEffect(() => {
        // Fetch notifications based on the user ID from local storage
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/notifications/${userId}`);
                const data = await response.json();
                console.log("Fetched notifications:", data); // Log the fetched data

                // Ensure that data is an array before setting it
                if (Array.isArray(data)) {
                    setNotifications(data);
                    logAction(userId, 'Fetched notifications', data.length); // Log action when notifications are fetched
                } else {
                    console.error('Expected an array but got:', data);
                    setNotifications([]); // Reset to an empty array if not an array
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                logAction(userId, 'Error fetching notifications', error.message); // Log action on error
            }
        };

        fetchNotifications();
    }, [userId]);

    const markAsRead = async (id) => {
        try {
            // Send the request to mark the notification as read
            await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
                method: 'PATCH',
            });

            // Update the state to mark notification as read
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => {
                    if (notification.id === id) {
                        return { ...notification, status: 'read' };
                    }
                    return notification;
                })
            );

            // Add the notification ID to the list of read notifications and store in localStorage
            const updatedReadNotifications = [...readNotifications, id];
            setReadNotifications(updatedReadNotifications);
            localStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));

            // Log action for marking as read
            logAction(userId, 'Marked notification as read', id);

            // Set a timeout to hide the notification after 10 seconds
            setTimeout(() => {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== id)
                );
            }, 10000); // 10000ms = 10 seconds
        } catch (error) {
            console.error('Error marking notification as read:', error);
            logAction(userId, 'Error marking notification as read', error.message); // Log error action
        }
    };

    return (
        <>
            <Navbar />
            <div className="notification-container mt-5">
                <h2>Notifications</h2>
                {notifications.length === 0 ? (
                    <div className="no-notifications">
                        <p>No notifications available 🙌</p>
                    </div>
                ) : (
                    notifications
                        .filter((notification) => !readNotifications.includes(notification.id)) // Hide read notifications
                        .map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item ${notification.status === 'unread' ? 'unread' : 'read'}`}
                            >
                                <div className="notification-message">
                                    <p>{notification.message}</p>
                                    <p className="timestamp">{new Date(notification.created_at).toLocaleString()}</p>
                                </div>
                                {notification.status === 'unread' && (
                                    <button
                                        className="mark-as-read-btn"
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        ))
                )}
            </div>
        </>
    );
};

export default Notification;
