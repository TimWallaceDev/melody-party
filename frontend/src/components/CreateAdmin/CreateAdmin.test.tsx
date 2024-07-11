import { render, fireEvent, screen } from '@testing-library/react';
import { CreateAdmin } from './CreateAdmin';
import { Socket } from 'socket.io-client';

describe('CreateAdmin Component', () => {
  const mockSocket = {
    emit: jest.fn(),
  } as unknown as Socket;

  const mockSetRoomIsCreated = jest.fn();

  const defaultProps = {
    socket: mockSocket,
    setRoomIsCreated: mockSetRoomIsCreated,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { container } = render(<CreateAdmin {...defaultProps} />);
    expect(container).toBeTruthy;
  });

  test('handles playlist change', () => {
    render(<CreateAdmin {...defaultProps} />);
    
    const playlistInput = screen.getByPlaceholderText('playlist URL eg.https://spotify.com/playlist/123456789') as HTMLInputElement;
    fireEvent.change(playlistInput, { target: { value: 'https://spotify.com/playlist/123' } });
    
    expect(playlistInput.value).toBe('https://spotify.com/playlist/123');
  });

  test('handles amount button clicks', () => {
    render(<CreateAdmin {...defaultProps} />);

    const amountButton = screen.getByText('25');
    fireEvent.click(amountButton);

    expect(amountButton.style.backgroundColor).toBe("green");
  });

  test('submits the form and emits the correct socket event', () => {
    render(<CreateAdmin {...defaultProps} />);

    //enter playlist URL
    const playlistInput = screen.getByPlaceholderText('playlist URL eg.https://spotify.com/playlist/123456789');
    fireEvent.change(playlistInput, { target: { value: 'https://spotify.com/playlist/123' } });

    //choose amount of rounds
    const amountButton = screen.getByText('10');
    fireEvent.click(amountButton);
    
    //click submit
    const submitButton = screen.getAllByText('Create Room')[1];
    fireEvent.click(submitButton);

    expect(mockSocket.emit).toHaveBeenCalledWith('create room', 'https://spotify.com/playlist/123', 10);
    expect(mockSetRoomIsCreated).toHaveBeenCalledWith(true);
  });
  test("Socket emits 1 time when valid form is submitted", () => {
    render(<CreateAdmin {...defaultProps} />);

    //enter playlist URL
    const playlistInput = screen.getByPlaceholderText('playlist URL eg.https://spotify.com/playlist/123456789');
    fireEvent.change(playlistInput, { target: { value: 'https://spotify.com/playlist/123' } });

    //choose amount of rounds
    const amountButton = screen.getByText('10');
    fireEvent.click(amountButton);
    
    //click submit
    const submitButton = screen.getAllByText('Create Room')[1];
    fireEvent.click(submitButton);

    expect(mockSocket.emit).toHaveBeenCalledTimes(1)
  })
  test("Form is not submitted when playlist url is empty", () => {
    render(<CreateAdmin {...defaultProps} />);

    const submitButton = screen.getAllByText("Create Room")[1]
    fireEvent.click(submitButton)

    expect(mockSocket.emit).toHaveBeenCalledTimes(0)
  })
});