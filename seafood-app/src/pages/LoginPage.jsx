import { useState } from 'react';
import { User, Building2, Home } from 'lucide-react';

export function LoginPage({ onNavigate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const roles = [
    {
      id: 'buyer',
      icon: User,
      title: 'Người mua',
      description: 'Mua hải sản tươi sống chất lượng cao'
    },
    {
      id: 'business',
      icon: Building2,
      title: 'Doanh nghiệp',
      description: 'Tìm nguồn hải sản số lượng lớn'
    },
    {
      id: 'farmer',
      icon: Home,
      title: 'Người nuôi',
      description: 'Đăng bán sản lượng hải sản'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    if (isLogin) {
      // --- LOGIC ĐĂNG NHẬP ---
      const user = existingUsers.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert(`Đăng nhập thành công với vai trò: ${user.role}`);
        
        onNavigate(`dashboard-${user.role}`);
      } else {
        alert('Email/Số điện thoại hoặc mật khẩu không chính xác!');
      }
    } else {
      // --- LOGIC ĐĂNG KÝ ---
      if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
      }

      if (existingUsers.some(u => u.email === email)) {
        alert('Email/Số điện thoại này đã được sử dụng!');
        return;
      }

      const newUser = {
        name: fullName,
        email: email,
        password: password,
        role: selectedRole,
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
      setIsLogin(true);
      setSelectedRole(null);
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Illustration */}
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1611794501034-13369f948303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYmx1ZXxlbnwxfHx8fDE3NzI2MzU4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Seafood"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <svg width="60" height="60" viewBox="0 0 40 40" fill="none">
                  <path d="M20 5C15 5 10 8 8 12C6 16 8 20 10 22C12 24 16 26 20 28C24 26 28 24 30 22C32 20 34 16 32 12C30 8 25 5 20 5Z" fill="#0A2647"/>
                  <ellipse cx="20" cy="15" rx="8" ry="5" fill="#2C5F8D"/>
                  <path d="M20 18C22 18 24 17 25 15.5C26 14 26 12 25 11C24 10 22 9 20 9C18 9 16 10 15 11C14 12 14 14 15 15.5C16 17 18 18 20 18Z" fill="#00BCD4"/>
                  <circle cx="18" cy="13" r="1.5" fill="white"/>
                </svg>
              </div>
              <h1 className="mb-2 font-bold text-2xl" style={{ color: '#0A2647' }}>
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? 'Chào mừng bạn trở lại' : 'Tạo tài khoản mới'}
              </p>
            </div>

            {!isLogin && !selectedRole ? (
              /* Role Selection */
              <div>
                <h3 className="mb-4 text-center font-medium" style={{ color: '#0A2647' }}>Chọn loại tài khoản</h3>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className="p-4 border rounded-lg hover:border-[#00BCD4] hover:bg-blue-50 transition-colors text-left"
                        style={{ borderColor: '#e5e7eb' }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: '#0A2647' }}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="mb-1 font-semibold" style={{ color: '#0A2647' }}>{role.title}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setIsLogin(true)}
                  className="w-full mt-6 text-center text-sm font-medium"
                  style={{ color: '#00BCD4' }}
                >
                  Đã có tài khoản? Đăng nhập ngay
                </button>
              </div>
            ) : (
              /* Login/Register Form */
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm mb-2 font-medium">Họ và tên</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        style={{ borderColor: '#e5e7eb' }}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-2 font-medium">Số điện thoại hoặc Email</label>
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      placeholder="0901234567 hoặc email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">Mật khẩu</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm mb-2 font-medium">Xác nhận mật khẩu</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        style={{ borderColor: '#e5e7eb' }}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-cyan-500" />
                        Ghi nhớ đăng nhập
                      </label>
                      <a href="#" className="font-medium" style={{ color: '#00BCD4' }}>Quên mật khẩu?</a>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-md text-white font-bold hover:opacity-90 transition-opacity shadow-md"
                    style={{ backgroundColor: '#00BCD4' }}
                  >
                    {isLogin ? 'Đăng nhập' : `Đăng ký với vai trò ${roles.find(r => r.id === selectedRole)?.title}`}
                  </button>
                </div>

                <div className="mt-6 text-center text-sm">
                  {isLogin ? (
                    <p>
                      Chưa có tài khoản?{' '}
                      <button 
                        type="button"
                        onClick={() => {
                          setIsLogin(false);
                          setSelectedRole(null);
                        }}
                        className="font-bold"
                        style={{ color: '#00BCD4' }}
                      >
                        Đăng ký ngay
                      </button>
                    </p>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => {
                        setIsLogin(true);
                        setSelectedRole(null);
                      }}
                      className="font-medium"
                      style={{ color: '#00BCD4' }}
                    >
                      ← Quay lại đăng nhập
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t" style={{ borderColor: '#e5e7eb' }}>
                  <p className="text-center text-sm text-gray-600 mb-4">Hoặc đăng nhập với</p>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      className="flex-1 py-2 border rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      Google
                    </button>
                    <button 
                      type="button"
                      className="flex-1 py-2 border rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      Facebook
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}