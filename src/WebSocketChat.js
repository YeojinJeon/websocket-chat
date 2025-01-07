import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const WebSocketChat = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // A 컴퓨터의 IP 주소로 WebSocket 연결
        const ws = new WebSocket('ws://172.30.1.75:5002'); // A 컴퓨터 IP로 변경

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = (e) => {
            let message = '';
            if (typeof e.data === 'string') {
                try {
                    const parsedData = JSON.parse(e.data);
                    message = parsedData.message || e.data;
                } catch {
                    message = e.data;
                }
            }

            setMessages((prevMessages) => [...prevMessages, message]);
            console.log('Message from server:', message);
        };

        ws.onerror = (e) => {
            console.error('WebSocket error:', e.message);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        setSocket(ws);

        // 컴포넌트 언마운트 시 WebSocket 연결 닫기
        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (socket && message.trim()) {
            socket.send(message);
            setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>WebSocket Chat</Text>

            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
            />

            <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={message}
                onChangeText={setMessage}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        marginVertical: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default WebSocketChat;
