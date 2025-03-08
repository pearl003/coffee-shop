from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# 配置数据库
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coffee_shop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 定义数据模型
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    items = db.Column(db.JSON)
    total_price = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')

# 创建数据库表
with app.app_context():
    db.create_all()

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    new_order = Order(
        items=data['items'],
        total_price=data['total_price']
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify({
        'message': '订单创建成功',
        'order_id': new_order.id
    }), 201

@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([{
        'id': order.id,
        'items': order.items,
        'total_price': order.total_price,
        'created_at': order.created_at.isoformat(),
        'status': order.status
    } for order in orders])

@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.json
    order.status = data['status']
    db.session.commit()
    return jsonify({'message': '订单状态更新成功'})

if __name__ == '__main__':
    app.run(debug=True) 