import { getProducts, getCategories } from './data_manager.js';
import { renderProductCard } from './ui_components.js';
import { getQueryParam } from './router.js';

let allProducts = [];
let currentView = 'grid';

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    const productCount = document.getElementById('product-count');
    const noResults = document.getElementById('no-results');

    if (products.length === 0) {
        productList.innerHTML = '';
        noResults.classList.remove('hidden');
        productCount.textContent = '0 products found.';
        return;
    }

    noResults.classList.add('hidden');
    productList.innerHTML = products.map(p => renderProductCard(p, currentView === 'list')).join('');
    productCount.textContent = `${products.length} product${products.length > 1 ? 's' : ''} found.`;
    lucide.createIcons();
}

function filterAndRender() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const checkedCategories = [...document.querySelectorAll('#category-filter-options input:checked')].map(el => el.value);

    let filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = checkedCategories.length === 0 || checkedCategories.includes(product.category);
        return matchesSearch && matchesCategory;
    });

    renderProducts(filteredProducts);
}

function setupFilters() {
    const categoryContainer = document.getElementById('category-filter-options');
    const categories = getCategories();
    
    categoryContainer.innerHTML = categories.map(cat => `
        <label class="flex items-center space-x-3">
            <input type="checkbox" value="${cat.name}" class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 category-checkbox">
            <span class="text-slate-700">${cat.name}</span>
        </label>
    `).join('');

    const urlCategory = getQueryParam('category');
    if (urlCategory) {
        const checkbox = document.querySelector(`input[value="${urlCategory}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    }

    document.getElementById('search-input').addEventListener('input', filterAndRender);
    document.querySelectorAll('.category-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', filterAndRender);
    });
}

function setupViewToggle() {
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const productList = document.getElementById('product-list');

    gridBtn.addEventListener('click', () => {
        currentView = 'grid';
        gridBtn.classList.add('bg-primary-500', 'text-white');
        gridBtn.classList.remove('text-slate-500', 'hover:bg-slate-200');
        listBtn.classList.remove('bg-primary-500', 'text-white');
        listBtn.classList.add('text-slate-500', 'hover:bg-slate-200');
        
        productList.classList.remove('grid-cols-1');
        productList.classList.add('sm:grid-cols-2', 'lg:grid-cols-3');
        filterAndRender();
    });

    listBtn.addEventListener('click', () => {
        currentView = 'list';
        listBtn.classList.add('bg-primary-500', 'text-white');
        listBtn.classList.remove('text-slate-500', 'hover:bg-slate-200');
        gridBtn.classList.remove('bg-primary-500', 'text-white');
        gridBtn.classList.add('text-slate-500', 'hover:bg-slate-200');

        productList.classList.remove('sm:grid-cols-2', 'lg:grid-cols-3');
        productList.classList.add('grid-cols-1');
        filterAndRender();
    });
}

export function initCatalogPage() {
    allProducts = getProducts();
    setupFilters();
    setupViewToggle();
    

    const productList = document.getElementById('product-list');
    productList.classList.add('grid', 'gap-8', 'sm:grid-cols-2', 'lg:grid-cols-3');
    filterAndRender();
}
