const form = document.getElementById('orderForm');
const tableBody = document.querySelector('#ordersTable tbody');

function getCurrentDateHijri() {
  const now = new Date();
  const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(now);
  return hijriDate; // مثل: ١٠ ربيع الأول ١٤٤٥
}

function getOrders() {
  return JSON.parse(localStorage.getItem('orders') || '[]');
}

function saveOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function loadOrders() {
  const orders = getOrders();
  tableBody.innerHTML = '';

  orders.forEach((order, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.customer}</td>
      <td>${order.product}</td>
      <td>${order.quantity}</td>
      <td>${order.price}</td>
      <td>${order.date}</td>
      <td>${order.paid ? 'نعم' : 'لا'}</td>
      <td><button class="delete-btn" onclick="deleteOrder(${index})">حذف</button></td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const confirmation = confirm('هل انت متأكد من الحذف؟');
      if (confirmation) {
        const row = this.closest('tr');
        row.remove();
      }
    });
  });

  document.querySelectorAll('.payment-status select').forEach(select => {
    select.addEventListener('change', function () {
      console.log(`Payment status changed to: ${this.value}`);
    });
  });
}

function deleteOrder(index) {
  const orders = getOrders();
  const paid = confirm('هل تم الدفع؟');
  orders[index].paid = paid;
  saveOrders(orders);
  loadOrders();
}

function handleProductChange() {
  const product = document.getElementById('product').value;
  const dynamicField = document.getElementById('dynamicField');
  dynamicField.innerHTML = ''; // تفريغ الحقل الديناميكي

  if (product === 'البهارات الرهيبة 😎') {
    dynamicField.innerHTML = `
      <label>نوع البهارات الرهيبة 😎:</label>
      <input type="text" id="spiceType" required>
    `;
  } else if (product === 'القهوة الرهيبة 😎') {
    dynamicField.innerHTML = `
      <label>التعبئة:</label>
      <select id="coffeePackaging" required>
        <option value="علبة">علبة</option>
        <option value="كيس">كيس</option>
      </select>
    `;
  }
}

// Ensure the correct dynamic field is displayed on page load
document.addEventListener('DOMContentLoaded', () => {
  handleProductChange();
});

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const product = document.getElementById('product').value;
  const order = {
    customer: document.getElementById('customer').value,
    product,
    quantity: document.getElementById('quantity').value,
    price: document.getElementById('price').value,
    date: getCurrentDateHijri(),
    paid: false,
    details: product === 'البهارات الرهيبة 😎' 
      ? document.getElementById('spiceType').value 
      : document.getElementById('coffeePackaging').value
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  loadOrders();
  form.reset();
  handleProductChange(); // Reset dynamic field
});

// تحميل الطلبات عند تشغيل الصفحة
loadOrders();
document.getElementById('product').addEventListener('change', handleProductChange);
