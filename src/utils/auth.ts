export interface AdminSession {
  username: string;
  loginTime: number;
  expiresAt: number;
}

export const checkAdminSession = (): boolean => {
  try {
    const sessionData = localStorage.getItem('adminSession');
    console.log('Перевірка даних сесії:', sessionData);
    if (!sessionData) return false;

    const session: AdminSession = JSON.parse(sessionData);
    console.log('Розпарсена сесія:', session);
    
    // Проверяем, не истекла ли сессия
    if (Date.now() > session.expiresAt) {
      console.log('Сесія закінчилася');
      localStorage.removeItem('adminSession');
      return false;
    }

    console.log('Сесія дійсна');
    return true;
  } catch (error) {
    console.error('Помилка перевірки адмін сесії:', error);
    localStorage.removeItem('adminSession');
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('adminSession');
};

export const getAdminSession = (): AdminSession | null => {
  try {
    const sessionData = localStorage.getItem('adminSession');
    if (!sessionData) return null;

    const session: AdminSession = JSON.parse(sessionData);
    
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('adminSession');
      return null;
    }

    return session;
  } catch (error) {
    console.error('Помилка отримання адмін сесії:', error);
    localStorage.removeItem('adminSession');
    return null;
  }
};