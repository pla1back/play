// Основные переменные
let visitorCount = 1254;
let isMenuOpen = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    initializeImageModal();
    updateVisitorCounter();
    setupFormValidation();
    setupLogoutButton();
    
    // Запускаем обновление счетчика каждые 5 секунд
    setInterval(updateVisitorCounter, 5000);
});

// Инициализация мобильного меню
function initializeMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const verticalMenu = document.getElementById('verticalMenu');
    
    if (menuToggle && verticalMenu) {
        menuToggle.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            verticalMenu.style.display = isMenuOpen ? 'flex' : 'none';
            menuToggle.innerHTML = isMenuOpen ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие меню при клике на ссылку
        const menuLinks = verticalMenu.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                verticalMenu.style.display = 'none';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                isMenuOpen = false;
            });
        });
    }
}

// Инициализация модального окна для изображений
function initializeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    const newsImages = document.querySelectorAll('.news-image');
    
    if (!modal) return;
    
    // Открытие модального окна при клике на изображение
    newsImages.forEach(image => {
        image.addEventListener('click', function() {
            const largeImage = this.getAttribute('data-large') || this.src;
            modalImage.src = largeImage;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Закрытие модального окна
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Закрытие при клике вне изображения
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Закрытие клавишей Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Обновление счетчика посетителей
function updateVisitorCounter() {
    const counterElement = document.getElementById('visitorCount');
    if (!counterElement) return;
    
    // Имитация случайного увеличения счетчика
    const increment = Math.floor(Math.random() * 3) + 1;
    visitorCount += increment;
    
    // Анимация обновления
    counterElement.classList.remove('count-up');
    void counterElement.offsetWidth; // Сброс анимации
    counterElement.textContent = visitorCount.toLocaleString();
    counterElement.classList.add('count-up');
}

// Валидация форм
function setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Имитация отправки формы
                showSuccessMessage('Форма успешно отправлена!');
                form.reset();
            } else {
                showErrorMessage('Пожалуйста, исправьте ошибки в форме');
            }
        });
    });
    
    // Валидация для регистрационной формы
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const fioInput = document.getElementById('fio');
        const emailInput = document.getElementById('email');
        
        // Проверка уникальности логина
        if (loginInput) {
            loginInput.addEventListener('blur', function() {
                validateLogin(this.value);
            });
        }
        
        // Проверка совпадения паролей
        if (passwordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', function() {
                if (passwordInput.value !== this.value) {
                    showFieldError(this, 'Пароли не совпадают');
                }
            });
        }
        
        // Валидация ФИО (только кириллица, дефис и пробелы)
        if (fioInput) {
            fioInput.addEventListener('blur', function() {
                const fioRegex = /^[А-Яа-яЁё\s-]+$/;
                if (!fioRegex.test(this.value)) {
                    showFieldError(this, 'ФИО должно содержать только кириллические буквы, дефис и пробелы');
                }
            });
        }
        
        // Валидация email
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    showFieldError(this, 'Введите корректный email адрес');
                }
            });
        }
    }
}

// Валидация отдельного поля
function validateField(field) {
    if (!field.value.trim()) {
        showFieldError(field, 'Это поле обязательно для заполнения');
        return false;
    }
    
    clearError(field);
    return true;
}

// Проверка уникальности логина
function validateLogin(login) {
    // Имитация проверки на сервере
    if (login === 'admin') {
        showFieldError(document.getElementById('login'), 'Этот логин уже занят');
        return false;
    }
    return true;
}

// Показать ошибку для поля
function showFieldError(field, message) {
    clearError(field);
    
    field.classList.add('error');
    
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Очистить ошибку поля
function clearError(field) {
    field.classList.remove('error');
    
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 300);
    }
}

// Показать сообщение об успехе
function showSuccessMessage(message) {
    showMessage(message, 'success');
}
// Показать сообщение об ошибке
function showErrorMessage(message) {
    showMessage(message, 'error');
}

// Показать сообщение
function showMessage(message, type) {
    // Удаляем существующие сообщения
    const existingMessages = document.querySelectorAll('.notification');
    existingMessages.forEach(msg => msg.remove());
    
    // Создаем новое сообщение
    const notification = document.createElement('div');
    notification.className = notification ${type};
    notification.textContent = message;
    notification.style.cssText = 
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    ;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else {
        notification.style.backgroundColor = '#e74c3c';
    }
    
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Добавляем стили для анимации
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = 
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        ;
        document.head.appendChild(style);
    }
}

// Настройка кнопки выхода
function setupLogoutButton() {
    const logoutButtons = document.querySelectorAll('.logout-btn');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Вы уверены, что хотите выйти?')) {
                // Имитация выхода
                window.location.href = 'index.html';
            }
        });
    });
}

// Функции для работы с заявками
function createRequest() {
    const title = document.getElementById('requestTitle')?.value;
    const description = document.getElementById('requestDescription')?.value;
    const category = document.getElementById('requestCategory')?.value;
    
    if (!title  !description  !category) {
        showErrorMessage('Все поля обязательны для заполнения');
        return false;
    }
    
    // Имитация создания заявки
    showSuccessMessage('Заявка успешно создана!');
    
    // Перенаправление на страницу заявок
    setTimeout(() => {
        window.location.href = 'requests.html';
    }, 1500);
    
    return false;
}

function deleteRequest(button) {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) {
        return;
    }
    
    // Имитация удаления заявки
    const row = button.closest('tr');
    row.style.opacity = '0.5';
    
    setTimeout(() => {
        row.remove();
        showSuccessMessage('Заявка успешно удалена');
    }, 500);
}

function filterRequests(status) {
    const rows = document.querySelectorAll('.requests-table tbody tr');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Обновление активной кнопки
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        }
    });
    
    // Фильтрация строк
    rows.forEach(row => {
        if (status === 'all' || row.dataset.status === status) {
            row.style.display = '';
            setTimeout(() => {
                row.classList.add('fade-in');
            }, 10);
        } else {
            row.style.display = 'none';
        }
    });
}
// Функции для администратора
function changeRequestStatus(requestId, newStatus) {
    if (newStatus === 'rejected') {
        const reason = prompt('Укажите причину отказа:');
        if (!reason) {
            showErrorMessage('Причина отказа обязательна');
            return;
        }
    }
    
    // Имитация изменения статуса
    showSuccessMessage(Статус заявки #${requestId} изменен на "${newStatus === 'solved' ? 'Решена' : 'Отклонена'}");
    
    // Обновление отображения
    const statusElement = document.querySelector([data-request="${requestId}"] .status);
    if (statusElement) {
        statusElement.textContent = newStatus === 'solved' ? 'Решена' : 'Отклонена';
        statusElement.className = status ${newStatus};
    }
}

function addCategory() {
    const input = document.getElementById('newCategory');
    if (!input || !input.value.trim()) {
        showErrorMessage('Введите название категории');
        return;
    }
    
    const categoryName = input.value.trim();
    
    // Имитация добавления категории
    const list = document.querySelector('.category-list');
    if (list) {
        const li = document.createElement('li');
        li.innerHTML = 
            <span>${categoryName}</span>
            <button class="btn btn-outline" onclick="removeCategory(this)">Удалить</button>
        ;
        list.appendChild(li);
        
        showSuccessMessage(Категория "${categoryName}" добавлена);
        input.value = '';
    }
}

function removeCategory(button) {
    if (!confirm('Удалить эту категорию?')) {
        return;
    }
    
    const li = button.closest('li');
    li.style.opacity = '0.5';
    
    setTimeout(() => {
        li.remove();
        showSuccessMessage('Категория удалена');
    }, 500);
}

// Инициализация анимаций при прокрутке
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.news-card, .car-card, .section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Запуск анимаций при прокрутке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}